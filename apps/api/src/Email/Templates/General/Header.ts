import { Company_Logo_Url, Company_Name, Company_Website } from "../../../Config";

export default async () => `
<div style="margin-bottom: 5px;
padding: 10px 0;
text-align: center;">
    <div class="logo">
        <a href="${await Company_Website()}" target="_blank">
            <img width="256" src="${await Company_Logo_Url()}" alt="${await Company_Name()}" />
        </a>
    </div>
</div>
`;