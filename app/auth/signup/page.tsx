import { Metadata } from "next"
import SignUp from "./signup"

export const metadata: Metadata = {
    title: "Sign up - Healthcare Platform",
    description: "Create an account to access personalized healthcare services",
}

export default function Page() {
    return <SignUp />
}