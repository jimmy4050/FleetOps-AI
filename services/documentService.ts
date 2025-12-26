
import { supabase } from '../lib/supabase';
import { FleetDocument, DocumentType } from '../types';

export const documentService = {
  async getAllDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FleetDocument[];
  },

  async uploadDocument(
    file: File, 
    metadata: { 
      name: string; 
      type: DocumentType; 
      expiryDate?: string; 
      vehicleId?: string; 
      driverId?: string 
    }
  ) {
    // 1. Upload file to Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('fleet-docs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Save metadata to Database
    const { data, error: dbError } = await supabase
      .from('documents')
      .insert([{
        name: metadata.name,
        type: metadata.type,
        filePath: filePath,
        fileType: file.type,
        fileSize: file.size,
        expiryDate: metadata.expiryDate,
        vehicleId: metadata.vehicleId,
        driverId: metadata.driverId,
        createdAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    return data as FleetDocument;
  },

  async getDownloadUrl(filePath: string) {
    const { data, error } = await supabase.storage
      .from('fleet-docs')
      .createSignedUrl(filePath, 3600); // 1 hour link
    
    if (error) throw error;
    return data.signedUrl;
  },

  async deleteDocument(id: string, filePath: string) {
    // Delete from storage
    await supabase.storage
      .from('fleet-docs')
      .remove([filePath]);

    // Delete from DB
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
