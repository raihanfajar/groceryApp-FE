import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeftNavUserProfile from "@/components/userProfile/LeftNavUserProfile";
import SettingsPersonalInfo from "@/components/userProfile/myAccount/SettingsPersonalInfo";

const UserProfilePage = () => {
  return (
    <main className="mx-auto min-h-[calc(100vh-100px)] bg-[#f9fafb] md:px-8 lg:px-16">
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* Left Navigation */}
        <aside className="hidden h-fit w-full lg:block lg:w-1/5">
          <LeftNavUserProfile />
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-hidden">
          <Card className="h-full rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Avatar + Change password */}
              <div className="flex flex-col items-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-gray-300"></div>
                <Button className="cursor-pointer rounded-full bg-green-600 px-4 text-white hover:bg-green-700">
                  Change Password
                </Button>
              </div>

              {/* Personal Info */}
              <SettingsPersonalInfo />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default UserProfilePage;
