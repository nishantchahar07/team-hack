import { Metadata } from "next"
import SignIn from "./signin"

export const metadata: Metadata = {
    title: "Sign in - Healthcare Platform",
    description: "Log in to access your healthcare services",
}

export default function Page() {
    return <SignIn />
}