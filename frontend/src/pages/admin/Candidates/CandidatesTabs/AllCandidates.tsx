import { useState } from "react";
import AllCandidateActionHeader from "./AllCandidateActionHeader";
import TextAreaFieldEditor from "@/components/common/form/fields/text-area-field-editor";

const AllCandidates = () => {
    const [sortBy, setSortBy] = useState("-created_at");
    return (
        <div>
            <AllCandidateActionHeader setSortBy={setSortBy} sortBy={sortBy} />
            <TextAreaFieldEditor/>

        </div>
    )
}

export default AllCandidates;