import { Metadata } from "next"
import Verify from "./verify"

export const metadata: Metadata = {
    title: "Verify - Healthcare Platform",
    description: "Welcome to our healthcare platform, where you can find the best doctors, hospitals, and labs tailored to your needs.",
}

export default function Page() {
    return <Verify />
}