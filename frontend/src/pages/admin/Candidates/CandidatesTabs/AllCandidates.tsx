/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AllCandidateActionHeader from "./AllCandidateActionHeader";
import * as yup from "yup";


export const StepTwoFormYupSchema = yup.object({
    description:yup.string().required("description is required"),});

const AllCandidates = () => {
    const [sortBy, setSortBy] = useState("-created_at");


    return (
        <div>
            <AllCandidateActionHeader setSortBy={setSortBy} sortBy={sortBy} />
        </div>
    )
}

export default AllCandidates;