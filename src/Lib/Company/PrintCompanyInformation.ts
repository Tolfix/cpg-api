import { stripIndents } from "common-tags";
import { Company_Address, Company_City, Company_Country, Company_Name, Company_Zip } from "../../Config";

export = async () => stripIndents`
<div>
    <p>
    <strong>
        ${await Company_Name()}
    </strong>
    <br/>
    ${await Company_Address()}
    <br/>
    ${await Company_Zip()}, ${await Company_City()}
    <br/>
    ${await Company_Country()}
    <br />
</div>
`