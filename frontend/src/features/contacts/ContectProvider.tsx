import React, { useEffect } from "react";
import { Contact } from "./models";
import useHttp from "@/hooks/useHttp";
import { useConfiguration } from "@/providers/ConfigurationProvider";


interface ContactStoreProps {
    contacts: Contact[];
    filteredContacts: Contact[];
    reloadContacts: () => void;
    addContact: (contact: Partial<Contact>, onSuccess: (e:Contact) => void) => void;
    updateContact: (id:string, contact: Partial<Contact>, onSuccess: (e:Contact) => void) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    currentPage: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    totalPages: number;
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
    startIndex: number;
    endIndex: number;
    loading?: boolean;
    error?: string;
}

const defaultContactStoreProps: ContactStoreProps = {
    contacts: [],
    filteredContacts: [],
    reloadContacts: () => {},
    addContact: (_contact: Partial<Contact>, _onSuccess = () => {}) => {},
    updateContact: (_id:string, _contact: Partial<Contact>, _onSuccess = () => {}) => {},
    searchTerm: "",
    setSearchTerm: (_searchTerm: string) => {},
    currentPage: 1,
    setCurrentPage: (_page: number | ((prev: number) => number)) => {},
    totalPages: 0,
    itemsPerPage: 15,
    setItemsPerPage: (_itemsPerPage: number) => {},
    startIndex: 0,
    endIndex: 0,
    loading: false,
    error: undefined,
}


const ContactContext = React.createContext<ContactStoreProps>(defaultContactStoreProps);
ContactContext.displayName = "ContactContext";

export const ContactContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = React.useState<Contact[]>([]);
    const [currentPage, setCurrentPageState] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const getAllHttp = useHttp();
    const updateContactHttp = useHttp();
    const {configuration} = useConfiguration();

    const [totalPages, setTotalPages] = React.useState(0);
    const [startIndex, setStartIndex] = React.useState(0);
    const [endIndex, setEndIndex] = React.useState(0);

    useEffect(() => {
        setItemsPerPage(configuration?.numberOfItemsPerPage ?? 15);
    }, [configuration]);


    useEffect(() => {
        setContacts([]);
        if (getAllHttp.response) {
            setContacts(getAllHttp.response as Contact[]);
        }
    }, [getAllHttp.response]);

    useEffect(() => {
        const filtered = contacts.filter((c) =>
            Object.values(c).some((value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredContacts(filtered);
        setTotalPages(itemsPerPage > 0 ? Math.ceil(filtered.length / itemsPerPage) : 0);
    }, [contacts, searchTerm, itemsPerPage]);

    useEffect(() => {
        setStartIndex((currentPage - 1) * itemsPerPage);
        setEndIndex(startIndex + itemsPerPage);
    }, [currentPage, itemsPerPage, startIndex]);

    const reloadContacts = () => {
        getAllHttp.sendRequest({
            url: "/customers",
            method: "GET"})
    };

    const addContact = (contact: Partial<Contact>, onSuccess: (e:Contact) => void ) => {
        const newContact = {
            ...contact,
            id: contact.id ?? Math.random().toString(36).substring(2, 15) // generate a random id if not provided
        }
        updateContactHttp.sendRequest({
            url: "/customers",
            method: "POST",
            data:newContact,
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            setContacts((prev) => [...prev, contact as Contact]);
            onSuccess(contact as Contact);
        })
    };

    const updateContact = (id:string, contact: Partial<Contact>, onSuccess: (e:Contact) => void) => {
        updateContactHttp.sendRequest({
            url: `/customers/${id}`,
            method: "PUT",
            data:contact,
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...contact } : c)));
            onSuccess(contact as Contact);
        })
    };

    // Replace setCurrentPage with a function that accepts number or updater
    const setCurrentPage = (page: number | ((prev: number) => number)) => {
        setCurrentPageState(page);
    };

    return (
        <ContactContext.Provider
            value={{
                contacts,
                filteredContacts,
                reloadContacts,
                addContact,
                updateContact,
                searchTerm,
                setSearchTerm,
                currentPage,
                setCurrentPage,
                totalPages,
                itemsPerPage,
                setItemsPerPage,
                startIndex,
                endIndex,
                loading: getAllHttp.loading || updateContactHttp.loading,
                error: getAllHttp.error || updateContactHttp.error,
            }}
        >
            {children}
        </ContactContext.Provider>
    );
};

export const useContacts = () => {
    const context = React.useContext(ContactContext);
    if (!context) {
        throw new Error("useContacts must be used within a ContactProvider");
    }
    return context;
}