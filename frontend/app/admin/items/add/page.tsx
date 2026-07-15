'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import axios from 'axios';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'your_api_key_here';

export default function AdminAddItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        price: '',
        location: '',
        category: '',
        imageUrl: '',
        bedrooms: '',
        bathrooms: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const formDataImg = new FormData();
            formDataImg.append('image', file);
            formDataImg.append('key', IMGBB_API_KEY);

            const res = await axios.post('https://api.imgbb.com/1/upload', formDataImg);
            if (res.data.success) {
                const url = res.data.data.url;
                setFormData(prev => ({ ...prev, imageUrl: url }));
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const requiredFields = ['title', 'shortDesc', 'fullDesc', 'price', 'location', 'category', 'imageUrl', 'bedrooms', 'bathrooms'];
        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                setLoading(false);
                return;
            }
        }

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
            };

            await api.post('/items/add', payload);
            toast.success('Property added successfully!');
            router.push('/admin/items/manage');
        } catch (error: any) {
            console.error('Add item error:', error);
            toast.error(error.response?.data?.message || 'Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
                href="/admin/items/manage"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Listings
            </Link>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="text-2xl">Add New Property</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Fill in the details to list a new property</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 2-column layout for better spacing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Sunset Villa"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="shortDesc">Short Description <span className="text-red-500">*</span></Label>
                                <Input
                                    id="shortDesc"
                                    placeholder="Brief summary (max 200 characters)"
                                    value={formData.shortDesc}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="fullDesc">Full Description <span className="text-red-500">*</span></Label>
                                <Input
                                    id="fullDesc"
                                    placeholder="Detailed description of the property"
                                    value={formData.fullDesc}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="e.g. 350000"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Gulshan, Dhaka"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value || '' })}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sale">For Sale</SelectItem>
                                        <SelectItem value="rent">For Rent</SelectItem>
                                        <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                                        <SelectItem value="furnished">Furnished</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="bedrooms">Bedrooms <span className="text-red-500">*</span></Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    placeholder="e.g. 3"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="bathrooms">Bathrooms <span className="text-red-500">*</span></Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    placeholder="e.g. 2"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            {/* Image Section - full width */}
                            <div className="md:col-span-2">
                                <Label>Property Image <span className="text-red-500">*</span></Label>
                                <div className="flex flex-col sm:flex-row gap-3 mt-1.5">
                                    <div className="relative flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11 border-dashed"
                                            disabled={uploading}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploading ? 'Uploading...' : 'Upload Image'}
                                        </Button>
                                    </div>
                                    <div className="flex items-center text-muted-foreground text-sm px-2">or</div>
                                    <div className="flex-1">
                                        <Input
                                            id="imageUrl"
                                            placeholder="Enter image URL directly"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                {formData.imageUrl && (
                                    <div className="mt-3 relative w-32 h-32 overflow-hidden rounded-lg border-2 border-muted">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base"
                            disabled={loading || uploading}
                        >
                            {loading ? 'Adding Property...' : 'Add Property'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}