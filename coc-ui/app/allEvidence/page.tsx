import { title } from "@/components/primitives";
import EvidenceList from "@/components/getAllEvidence";

export default function AllEvidencePage() {
  return (
    <div>
      <h1 className={title()}>All Evidence</h1>
      <EvidenceList />
    </div>
  );
}
