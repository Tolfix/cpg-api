import { NextComponentType } from "next"
import { useSession } from "next-auth/react"
import Login from "./Login"
import Navigation from "./Navigation";

export const Layout: NextComponentType = ({ children }) =>
{
    const { status, data } = useSession();
    
    if(status === "loading")
        return (
            <>
                {/* Tailwind center middle */}
                <div className="flex justify-center items-center h-screen">
                    <div className="w-full max-w-xs">
                        <div className="text-center">
                            <div className="text-gray-700 text-xl font-bold">
                                Loading..
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )

    if(!data)
        return <Login />;

    return (
        <>
            <div>
                <Navigation />
                {children}
            </div>
        </>
    )
}