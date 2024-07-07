import { title } from "@/components/primitives";
import CustodianTable from "@/components/getAllCustodians";

export default function AllCustodiansPage() {
  return (
    <div>
      <h1 className={title()}>Custodians</h1>
      <CustodianTable />
    </div>
  );
}
