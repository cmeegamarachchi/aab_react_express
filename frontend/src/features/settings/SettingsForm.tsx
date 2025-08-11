import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"

import { useConfiguration } from "@/providers/ConfigurationProvider"

const settingsSchema = z.object({
  baseUrl: z.string().url({ message: "Please enter a valid URL" }),
  itemsPerPage: z.number().int().positive().max(100),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  theme: z.enum(["light", "dark", "system"]),
})

type SettingsValues = z.infer<typeof settingsSchema>

export default function SettingsForm() {
  const config = useConfiguration()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      baseUrl: "",
      itemsPerPage: 10,
      apiKey: "nothing",
      theme: "light",
    },
  })

  useEffect(() => {
    form.reset({
      baseUrl: config.configuration.apiBaseUrl,
      itemsPerPage: config.configuration.numberOfItemsPerPage,
      apiKey: config.configuration.apiKey,
      theme: config.configuration.theme as "light" | "dark" | "system"
    })
  }, [config.configuration, form])

  async function onSubmit(data: SettingsValues) {
    setIsLoading(true)
    try {
      const currenrConfig = await config.configuration
      currenrConfig.apiBaseUrl = data.baseUrl
      currenrConfig.numberOfItemsPerPage = data.itemsPerPage 
      config.setConfiguration({...currenrConfig})

      toast({
        title: "Settings updated",
        description: "Your application settings have been successfully updated.",
      })

    } catch  {
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure the general settings for your application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>The base URL for your application.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemsPerPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items Per Page</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormDescription>The number of items to display per page (max 100).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure your API settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your API key for accessing external services.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the appearance of your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <select className="w-full p-2 border border-gray-300 rounded-md" {...field}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </FormControl>
                  <FormDescription>Choose the theme for your application.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Settings"}
        </Button>
      </form>
    </Form>
  )
}