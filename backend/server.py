from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from eth_account import Account
from flask import Flask, jsonify, request, g
import json
from web3 import Web3
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models import get_db, close_db
from utils import check_password, hash_password

app = Flask(__name__)
CORS(app)
load_dotenv()

app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")
jwt = JWTManager(app)

@app.teardown_appcontext
def teardown_db(exception):
    close_db()

ganache_url = "http://127.0.0.1:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Ensure connection is successful
assert web3.is_connected(), "Could not connect to Ganache"

# Compile your Solidity contract (assumed already compiled)
with open('ChainOfCustody.json') as f:
    contract_json = json.load(f)
    contract_abi = contract_json['abi']
    contract_bytecode = contract_json['bytecode']

# Set up your account (using the first account provided by Ganache)
account = web3.eth.accounts[0]

contract_address_path = 'contract_address.txt'
contract_abi_path = 'contract_abi.json'

def deploy_contract():
    # Create contract instance
    ChainOfCustody = web3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)

    # Deploy contract
    tx_hash = ChainOfCustody.constructor().transact({
        'from': account,
        'gas': 2000000,
        'gasPrice': web3.to_wei('50', 'gwei')
    })
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    # Get contract address
    contract_address = tx_receipt.contractAddress
    print(f"Contract deployed at address: {contract_address}")

    # Save the contract address and ABI for use in Flask
    with open(contract_address_path, 'w') as f:
        f.write(contract_address)
    with open(contract_abi_path, 'w') as f:
        json.dump(contract_abi, f)
    
    return contract_address, contract_abi

def load_contract():
    if os.path.exists(contract_address_path) and os.path.exists(contract_abi_path):
        # Load contract address and ABI
        with open(contract_address_path) as f:
            contract_address = f.read().strip()
        with open(contract_abi_path) as f:
            contract_abi = json.load(f)
    else:
        # Deploy contract and save address and ABI
        contract_address, contract_abi = deploy_contract()

    # Load contract
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)
    return contract

contract = load_contract()

def load_contract():
    if os.path.exists(contract_address_path) and os.path.exists(contract_abi_path):
        # Load contract address and ABI
        with open(contract_address_path) as f:
            contract_address = f.read().strip()
        with open(contract_abi_path) as f:
            contract_abi = json.load(f)
    else:
        # Deploy contract and save address and ABI
        contract_address = deploy_contract()

    # Load contract
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)
    return contract

contract = load_contract()

# Generate a new Ethereum account
account = Account.create()
address = account.address
private_key = account._private_key.hex()

# Example route to listen to CustodyTransferred events
@app.route('/api/listen_to_events', methods=['GET'])
def listen_to_events():
    event_filter = contract.events.CustodyTransferred.create_filter(fromBlock='latest')

    # Process events
    for event in event_filter.get_all_entries():
        # Handle event data here
        print(event)

    return jsonify({'message': 'Event listening started'})

def generate_eth_address():
    account = Account.create()
    return account.address

def save_custodian_to_db(name, eth_address):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO custodians (name, ethereum_address) VALUES (%s, %s)", (name, eth_address))

    conn.commit()
    cursor.close()
    conn.close()

# Get all custodians
@app.route("/api/custodians", methods=['GET'])
def home():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM custodians"
    cursor.execute(query)
    custodians = cursor.fetchall()

    try:
        return {"custodians": custodians}
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Internal Server Error
    

@app.route("/api/register", methods=["POST"])
def register_regular():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    print(data)

    # Extract user data with validation (optional)
    email = data.get("email")
    if not email:
        return jsonify({"error": "Missing email address"}), 400  # Bad request

    password = data.get("password")
    if not password:
        return jsonify({"error": "Missing password"}), 400

    # Check for existing email before insertion
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"error": "Email address already registered"}), 409  # Conflict

        # Generate password hash only if email doesn't exist
        pw_hash = hash_password(password)

        query = "INSERT INTO users(email, password_hash) VALUES(%s, %s)"
        vals = (email, pw_hash)

        cursor.execute(query, vals)
        conn.commit()

        return jsonify({'user_id': cursor.lastrowid}), 201  # Created

    except Exception as e:
        # Handle unexpected database errors gracefully
        conn.rollback()  # Undo any partial changes
        print(f"An error occurred during registration: {e}")
        return jsonify({"error": "Registration failed"}), 500  # Internal Server Error

    finally:
        # Ensure cursor and connection are closed properly
        cursor.close()
        conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    """Handles user login requests and returns an access token on success."""

    try:
        # Validate request data
        data = request.get_json()
        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"msg": "Missing required fields"}), 400

        email = data.get("email")
        password = data.get("password")

        # Securely fetch user with parameterized query
        query = "SELECT * FROM users WHERE email = %s"
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        vals = (email,)  # Use tuple for parameterized query
        cursor.execute(query, vals)
        user = cursor.fetchone()
        cursor.close()
        conn.close()  # Close connection after query execution

        # Check if user exists
        if not user:
            return jsonify({"msg": "User does not exist"}), 401

        # Verify password securely using check_password function
        verified = check_password(user['password_hash'].encode('utf-8'), password)
        if not verified:
            return jsonify({"msg": "Invalid credentials"}), 401

        # Generate access token (replace with your token generation logic)
        access_token = create_access_token(identity=email)
        # print("Generated access token:", access_token)  # Debugging statement
        return jsonify(access_token=access_token), 200

    except Exception as e:
        # Handle unexpected errors gracefully
        print(f"An error occurred during login: {e}")
        return jsonify({"msg": "Internal server error"}), 500


# Create a custodian 
@app.route('/api/generate_custodian', methods=['POST'])
def generate_custodian():
    data = request.json
    initial_custodian_name = data.get('name')
    
    if not initial_custodian_name:
        return jsonify({'error': 'Initial custodian name is required'}), 400

    print(f"Initial Custodian Name: {initial_custodian_name}")

    # Generate Ethereum address for the initial custodian
    generated_eth_address = generate_eth_address()

    # Save the initial custodian's name and generated Ethereum address to the database
    save_custodian_to_db(initial_custodian_name, generated_eth_address)

    return jsonify({'msg': 'Initial custodian has been generated and saved to the database.'})

# Initialize evidence
@app.route('/api/initialize_evidence', methods=['POST'])
def initialize_evidence():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    description = data['description']
    initial_custodian = data['initial_custodian']

    print(description, initial_custodian)

    tx_hash = contract.functions.initializeEvidence(description, initial_custodian).transact({
        'from': web3.eth.accounts[0]
    })
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    events = contract.events.EvidenceInitialized().process_receipt(receipt)
    evidenceId = None
    for event in events:
        if event['transactionHash'] == tx_hash:
            evidenceId = event['args']['evidenceId']
            break

    return jsonify({'tx_hash': tx_hash.hex(), 'evidenceId': evidenceId})

# Get all evidence in the blockchain
@app.route('/api/get_all_evidence', methods=['GET'])
def get_all_evidence():
    all_evidence = []

    # Assume nextEvidenceId is a state variable or tracked elsewhere in your app
    next_evidence_id = contract.functions.nextEvidenceId().call()

    for evidence_id in range(next_evidence_id):
        try:
            evidence_details = contract.functions.getEvidenceDetails(evidence_id).call()
            evidence = {
                'id': evidence_details[0],
                'description': evidence_details[1],
                'currentCustodian': evidence_details[2],
                'custodyHistory': evidence_details[3]
            }
            all_evidence.append(evidence)
        except Exception as e:
            print(f"Error fetching evidence {evidence_id}: {str(e)}")

    return jsonify({'evidence': all_evidence})

# Transfer custody
@app.route('/api/transfer_custody', methods=['POST'])
def transfer_custody():
    try:
        data = request.json
        evidence_id = data['evidence_id']
        new_custodian = data['new_custodian']

        # Fetch the current custodian from the contract
        current_custodian = contract.functions.getCurrentCustodian(evidence_id).call()
   

        print(f"NC: {new_custodian} ---- CC: {current_custodian}")

        # Ensure the current custodian is an account in Ganache
        if current_custodian not in web3.eth.accounts:
            print("Error curent custodian not recognised by ganache")
            return jsonify({'error': 'Current custodian account not recognized by Ganache'}), 400

        # Send transaction
        tx_hash = contract.functions.transferCustody(evidence_id, new_custodian).transact({
            'from': current_custodian
        })
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        return jsonify({'tx_hash': tx_hash.hex()})
    except ValueError as ve:
        print(f"VE: {ve}")
        return jsonify({'error': f"ValueError: {str(ve)}"}), 500
    except Exception as e:
        print("E: {e}")
        return jsonify({'error': f"Exception: {str(e)}"}), 500


# Update description
@app.route('/api/update_description', methods=['POST'])
def update_description():
    data = request.json
    evidence_id = data['evidence_id']
    new_description = data['new_description']
    
    tx_hash = contract.functions.updateDescription(evidence_id, new_description).transact({
        'from': web3.eth.accounts[0]
    })
    web3.eth.wait_for_transaction_receipt(tx_hash)
    
    return jsonify({'tx_hash': tx_hash.hex()})

# Get current custodian using evidence id
@app.route('/api/get_current_custodian/<int:evidence_id>', methods=['GET'])
def get_current_custodian(evidence_id):
    current_custodian = contract.functions.getCurrentCustodian(evidence_id).call()
    return jsonify({'current_custodian': current_custodian})

# Get custody history based on evidence id
@app.route('/api/get_custody_history/<int:evidence_id>', methods=['GET'])
def get_custody_history(evidence_id):
    custody_history = contract.functions.getCustodyHistory(evidence_id).call()
    if not isinstance(custody_history, list):
        custody_history = []
    return jsonify({'custody_history': custody_history})

# Get evidence details based on evidence id
@app.route('/api/get_evidence_details/<int:evidence_id>', methods=['GET'])
def get_evidence_details(evidence_id):
    details = contract.functions.getEvidenceDetails(evidence_id).call()
    return jsonify({
        'id': details[0],
        'description': details[1],
        'current_custodian': details[2],
        'custody_history': details[3]
    })

if __name__ == "__main__":
    app.run(port=7000, debug=True)
