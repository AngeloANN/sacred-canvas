CREATE POLICY "Admins can view artwork media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'artwork-media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload artwork media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'artwork-media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update artwork media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'artwork-media' AND private.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'artwork-media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete artwork media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'artwork-media' AND private.has_role(auth.uid(), 'admin'));