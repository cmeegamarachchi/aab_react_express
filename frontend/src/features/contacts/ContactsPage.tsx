import { BreadCrumbItem } from "@/components/SideNav/model";

import Layout from "./../Layout";
import ContactsDataGrid from "./ContactList";
import { ContactContextProvider } from "./ContectProvider";

const breadCrumbs: BreadCrumbItem[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Contacts",
    url: "/contacts",
  },
];

const ContactsPage = () => {
  return (
    <Layout titleToActivate="Contacts" breadcrumbs={breadCrumbs}>
      <Layout.Title>Contacts</Layout.Title>
      <ContactContextProvider>
        <ContactsDataGrid />
      </ContactContextProvider>
    </Layout>
  );
};

export default ContactsPage;
