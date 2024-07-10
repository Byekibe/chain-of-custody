import MakeCustodian from "@/components/makeCustodianForm";
import { title } from "@/components/primitives";

export default function MakeCustodianPage() {
  return (
    <div>
      <h1 className={title()}>Make Custodian</h1>
      <MakeCustodian />
    </div>
  );
}
