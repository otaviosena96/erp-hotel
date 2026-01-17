"use client"

import { createApiUrl } from '@/lib/config/api'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"



export default function Login() {

    const router = useRouter()

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const [errorDialog, setErrorDialog] = useState({
        open: false,
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(createApiUrl('/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }
            console.log("Sucesso:", data);
            localStorage.setItem('token', data.access_token);
            router.push('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao tentar fazer login';
            setErrorDialog({
                open: true,
                message: errorMessage
            });
            console.error("Erro no login:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-blue-600">MyHotel</CardTitle>
                <CardDescription className="text-center">
                    Sistema de Gestão Hoteleira<br/>
                    <span className="text-sm text-muted-foreground">Gerencie seus hotéis, reservas e hóspedes com eficiência</span>
                </CardDescription>           
            </CardHeader>
            <CardContent>
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">Faça o seu login</h3>
                    <p className="text-sm text-muted-foreground">Insira seu usuário e senha para acessar o sistema</p>
                </div>
                <form id="login-form"  onSubmit={handleSubmit} >
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="username"
                        placeholder="teste"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>                   
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        disabled={loading}
                    />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" form="login-form" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Login"}
                </Button>           
            </CardFooter>
            </Card>
            
            <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Erro no Login</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorDialog.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
