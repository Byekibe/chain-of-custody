import { title } from "@/components/primitives";
import GenerateCustodiansForm from "../../components/createCustodianForm";

export default function CreateCustodianPage() {
  return (
    <div>
      <h1 className={title()}>Create Custodian</h1>
      <GenerateCustodiansForm />
    </div>
  );
}
