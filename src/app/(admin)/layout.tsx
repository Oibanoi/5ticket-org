import LayoutHeader from "shared/components/layout/layout-header";
import { NavigationProvider } from "shared/providers/navigation"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="lg:ml-72 xl:ml-80">
        <LayoutHeader />

        <div className={"relative pt-14 min-h-screen"}>
         
          <div className="rounded-tl-4xl px-4 sm:px-6 lg:px-8 bg-gray-100 py-2">
            {children}
          </div>
        </div>
      </div>
    )
}

export default AdminLayout;