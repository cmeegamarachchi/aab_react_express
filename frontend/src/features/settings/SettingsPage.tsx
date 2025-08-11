import { BreadCrumbItem } from "@/components/SideNav/model";
import Layout from "./../Layout";
import SettingsForm from "./SettingsForm";

const breadCrumbs: BreadCrumbItem[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Settings",
    url: "/settings",
  },
];

const SettingsPage = () => {
  return (
    <Layout titleToActivate="Settings" breadcrumbs={breadCrumbs}>
      <Layout.Title>Settings</Layout.Title>
      <SettingsForm />
    </Layout>
  );
};

export default SettingsPage;
