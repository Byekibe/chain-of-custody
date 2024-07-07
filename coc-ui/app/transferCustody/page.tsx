import { title } from "@/components/primitives";
import TransferCustodyForm from "@/components/transferCustodyForm";

export default function TransferCustodyPage() {
  return (
    <div>
      <h1 className={title()}>Transfer Custody</h1>
      <TransferCustodyForm />
    </div>
  );
}
