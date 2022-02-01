import { useRouter } from "next/router";

const routes = [
    {
        path: '/',
        name: 'Home',
        exact: true,
    },
    {
        path: '/invoices',
        name: 'Invoices',
        exact: true,
    },
    {
        path: '/orders',
        name: 'Orders',
        exact: true,
    },
    {
        path: '/transactions',
        name: 'Transactions',
        exact: true,
    },
    {
        path: '/profile',
        name: 'Profile',
        exact: true,
    },
];

export default () =>
{
    const router = useRouter();
    return (
        <>

            <div className="bg-gray-100 font-sans w-full m-0">
                <div className="bg-white shadow">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between py-4">
                            <div>
                            {/* TODO: Put a svg in here for the logo.
                                Issue #5 (https://github.com/Tolfix/cpg-customer/issues/5)
                            */}
                            </div>

                            <div className="hidden sm:flex sm:items-center">
                                {routes.map((route) =>
                                {
                                    return (
                                        <a href={route.path}
                                           className={`
                                           text-sm font-semibold 
                                           ${route.path === router.pathname ? 'text-purple-500' : 'text-gray-800'}
                                           hover:text-purple-600 mr-4
                                           `}>{route.name}</a>
                                    )
                                })}
                            </div>

                            <div className="sm:hidden cursor-pointer">
                            {/* TODO: Put the same svg here*/}
                            </div>
                        </div>

                        <div className="block sm:hidden bg-white border-t-2 py-2">
                            <div className="flex flex-col">
                                {routes.map((route) =>
                                {
                                    return (
                                        <a href={route.path}
                                           className="text-gray-800 text-sm font-semibold hover:text-purple-600 mb-1">{route.name}</a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </>
    )
}