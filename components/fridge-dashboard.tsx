'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, RefreshCw, Trash2 } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

interface IngredientOption {
  name: string;
  fridgeLife: number; // in days
}

const ingredientOptions: IngredientOption[] = [
  { name: "Milk", fridgeLife: 7 },
  { name: "Eggs", fridgeLife: 21 },
  { name: "Cheese", fridgeLife: 14 },
  { name: "Yogurt", fridgeLife: 7 },
  { name: "Butter", fridgeLife: 30 },
  { name: "Lettuce", fridgeLife: 7 },
  { name: "Tomatoes", fridgeLife: 7 },
  { name: "Chicken", fridgeLife: 2 },
  { name: "Beef", fridgeLife: 3 },
  { name: "Fish", fridgeLife: 2 },
]

export default function FridgeDashboard() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Milk', quantity: '1L', expiryDate: '2023-06-30' },
    { id: 2, name: 'Eggs', quantity: '12', expiryDate: '2023-07-15' },
    { id: 3, name: 'Cheese', quantity: '200g', expiryDate: '2023-07-20' },
  ])

  const [recipes] = useState([
    { name: 'Scrambled Eggs', ingredients: ['Eggs', 'Milk', 'Salt'] },
    { name: 'Grilled Cheese Sandwich', ingredients: ['Bread', 'Cheese', 'Butter'] },
    { name: 'Omelette', ingredients: ['Eggs', 'Cheese', 'Vegetables'] },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  })

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (newIngredient.name && newIngredient.purchaseDate) {
      const selectedIngredient = ingredientOptions.find(i => i.name === newIngredient.name)
      if (selectedIngredient) {
        const purchaseDate = new Date(newIngredient.purchaseDate)
        const expiryDate = new Date(purchaseDate.getTime() + selectedIngredient.fridgeLife * 24 * 60 * 60 * 1000)
        setNewIngredient(prev => ({
          ...prev,
          expiryDate: expiryDate.toISOString().split('T')[0]
        }))
      }
    }
  }, [newIngredient.name, newIngredient.purchaseDate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewIngredient({ ...newIngredient, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = ingredients.length > 0 
      ? Math.max(...ingredients.map(i => i.id)) + 1 
      : 1
    setIngredients([...ingredients, { 
      id: newId,
      name: newIngredient.name, 
      quantity: newIngredient.quantity, 
      expiryDate: newIngredient.expiryDate 
    }])
    setIsOpen(false)
    setNewIngredient({
      name: '',
      quantity: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
    })
  }

  const handleRefreshExpiry = (id: number) => {
    const today = new Date()
    const newExpiryDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]
    setIngredients(ingredients.map(ingredient => 
      ingredient.id === id ? { ...ingredient, expiryDate: newExpiryDate } : ingredient
    ))
  }

  const handleDelete = (id: number) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fridge Management Dashboard</h1>
      <Tabs defaultValue="fridge" className="w-full">
        <TabsList>
          <TabsTrigger value="fridge">Fridge</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="fridge">
          <div className="mb-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload Ingredients
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Ingredient</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={dropdownOpen}
                          className="w-full justify-between"
                        >
                          {newIngredient.name
                            ? ingredientOptions.find((ingredient) => ingredient.name === newIngredient.name)?.name
                            : "Select ingredient..."}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search ingredient..." className="h-9" />
                          <CommandEmpty>No ingredient found.</CommandEmpty>
                          <CommandGroup>
                            {ingredientOptions.map((ingredient) => (
                              <CommandItem
                                key={ingredient.name}
                                onSelect={() => {
                                  setNewIngredient(prev => ({ ...prev, name: ingredient.name }))
                                  setDropdownOpen(false)
                                }}
                              >
                                {ingredient.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    newIngredient.name === ingredient.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" value={newIngredient.quantity} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">Date of Purchase</Label>
                    <Input id="purchaseDate" name="purchaseDate" type="date" value={newIngredient.purchaseDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Date of Expiry</Label>
                    <Input id="expiryDate" name="expiryDate" type="date" value={newIngredient.expiryDate} onChange={handleInputChange} required />
                  </div>
                  <Button type="submit">Add Ingredient</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.quantity}</TableCell>
                  <TableCell>{ingredient.expiryDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRefreshExpiry(ingredient.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh Expiry
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(ingredient.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="recipes">
          <div className="space-y-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">{recipe.name}</h3>
                <p className="text-sm text-gray-600">Ingredients: {recipe.ingredients.join(', ')}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}