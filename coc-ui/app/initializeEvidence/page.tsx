import { title } from "@/components/primitives";
import InitializeEvidenceForm from "@/components/InitializeEvidenceForm";

export default function InitializeEvidencePage() {
  return (
    <div>
      <h1 className={title()}>Initialize Evidence</h1>
      <InitializeEvidenceForm />
    </div>
  );
}
