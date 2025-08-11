import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Contact } from "./models"
import { PencilIcon } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ContactForm, { ContactFormValues } from "./ContactForm"
import { useContacts } from "./ContectProvider"
import { toast } from "@/hooks/use-toast"



const ContactsDataGrid:React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const {reloadContacts, contacts, addContact, updateContact, searchTerm, setSearchTerm
    , filteredContacts, startIndex, endIndex, currentPage, setCurrentPage
    , totalPages, error} = useContacts()
  

  useEffect(() => {
    reloadContacts()
  }, [])
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to process request. Plesae review application logs for more details.`,
        variant: "destructive",
      })
    }
  }, [error])

  const handleEdit = (id: string) => {
    const contact = contacts.find((c) => c.id === id) || null
    setEditingContact(contact)
    setSheetOpen(true)
  }

  const handleAdd = () => {
    setEditingContact(null)
    setSheetOpen(true)
  }

  const handleFormSubmit = (values: ContactFormValues) => {
    if (editingContact) {
      updateContact(editingContact.id, values, () => setSheetOpen(false));
    } else {
      addContact(values, () => setSheetOpen(false));
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAdd} className="ml-4">Add Contact</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{editingContact ? "Edit Contact" : "Add Contact"}</SheetTitle>
            </SheetHeader>
            <ContactForm
              initialValues={editingContact || undefined}
              onSubmit={handleFormSubmit}
            />
          </SheetContent>
        </Sheet>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Signed on</TableHead>
            <TableHead>Street Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.slice(startIndex, endIndex).map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.id}</TableCell>
              <TableCell>{contact.first_name}</TableCell>
              <TableCell>{contact.last_name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.signed_on_date ? new Date(contact.signed_on_date).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{contact.street_address}</TableCell>
              <TableCell>{contact.city}</TableCell>
              <TableCell>{contact.country}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleEdit(contact.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={`Edit ${contact.first_name} ${contact.last_name}`}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <Label >
          Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} entries
        </Label >
        <div className="space-x-2">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContactsDataGrid
