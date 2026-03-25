import { Resend } from "resend";
import resetEmail from "./reset-template";

type TemplateName = "reset";

type TemplateFn = (data: any) => {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
};

const templates: Record<TemplateName, TemplateFn> = {
    reset: (data) => ({
        from: "Analytics <onboarding@resend.dev>",
        to: data.to,
        subject: "Reset your password",
        html: resetEmail(data.url),
    }),
};

const send_email = async (
    api_key: string,
    payload: any,
    template: TemplateName,
) => {
    const resend = new Resend(api_key);

    const config = templates[template](payload);

    const { data, error } = await resend.emails.send(config);

    if (error) throw error;

    return data;
};

export default send_email;
