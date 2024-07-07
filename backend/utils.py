import bcrypt

def hash_password(password):
    """Hashes a password securely using bcrypt.

    Args:
        password (str): The plaintext password to be hashed.

    Returns:
        bytes: The hashed password as a bytes object.

    Raises:
        ValueError: If the password is not a string.
    """

    if not isinstance(password, str):
        raise ValueError("password must be a string")

    # Generate a random salt with a suitable cost factor (adjust as needed)
    salt = bcrypt.gensalt(rounds=12)

    # Hash the password with the generated salt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    return hashed_password

def check_password(stored_password_hash, provided_password):
    """Checks if a provided password matches a stored password hash.

    Args:
        stored_password_hash (bytes): The hashed password stored in the database.
        provided_password (str): The plaintext password entered during login.

    Returns:
        bool: True if the passwords match, False otherwise.

    Raises:
        ValueError: If the provided password is not a string.
    """
    if not isinstance(provided_password, str):
        raise ValueError("provided_password must be a string")

    # Verify the password using the stored hash
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password_hash)