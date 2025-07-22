import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Box, Container, Typography, Grid, Paper, Avatar, Divider, Stack,
    Button, List, ListItem, ListItemIcon, ListItemText, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, useTheme, Skeleton,
    Tabs, Tab, CircularProgress, Alert
} from '@mui/material';
import {
    Person, Mail, CalendarToday, LocationOn, Edit, Lock, Shield,
    CreditCard, AccountBalance, Home, VpnKey, PhoneAndroid, Business, Close, ErrorOutline,
    PhotoCamera, CloudUpload, AutoAwesome
} from '@mui/icons-material';

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { useUser } from '../../context/UserContext.jsx';
const API_URL = import.meta.env.VITE_API_URL || '';
import AppAppBar from '../../components/AppAppBar.jsx';
import { useNavigate } from "react-router-dom";

// MOCKS E COMPONENTES SEM ALTERAÇÃO...
const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });
const initialProfile = { id: 'CICARUS-8B7A', name: "Admin Cicarus", document: "123.456.789-00", email: "admin.cicarus@cicarusbank.com", birthDate: "01/01/1990", avatar: "", address: { country: "Brasil", state: "São Paulo", city: "São Paulo", street: "Avenida Principal, 123", zip: "01234-567" }, account: { type: "Conta Corrente Premium", agency: "0001", accountNumber: "123456-7", memberSince: "15/06/2020" }};
function EditProfileDialog({ open, onClose, data, onSave }) { const [form, setForm] = React.useState({ ...data }); React.useEffect(() => { setForm(data); }, [data]); const handleChange = (e) => { const { name, value } = e.target; if (name.includes('.')) { const [section, field] = name.split('.'); setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } })); } else { setForm(prev => ({ ...prev, [name]: value })); } }; const handleSubmit = () => { onSave(form); onClose(); }; const isFieldDisabled = (field) => ['name', 'document', 'birthDate'].includes(field); return ( <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth> <DialogTitle> Editar Perfil <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}> <Close /> </IconButton> </DialogTitle> <DialogContent dividers> <Grid container spacing={2}> <Grid item xs={12} md={6}> <TextField name="name" label="Nome Completo" value={form.name} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('name')} /> </Grid> <Grid item xs={12} md={6}> <TextField name="document" label="Documento (CPF)" value={form.document} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('document')} /> </Grid> <Grid item xs={12} md={6}> <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth margin="normal" /> </Grid> <Grid item xs={12} md={6}> <TextField name="birthDate" label="Data de Nascimento" value={form.birthDate} onChange={handleChange} fullWidth margin="normal" disabled={isFieldDisabled('birthDate')} /> </Grid> <Grid item xs={12} md={6}> <TextField name="address.street" label="Rua" value={form.address.street} onChange={handleChange} fullWidth margin="normal" /> </Grid> <Grid item xs={12} md={6}> <TextField name="address.city" label="Cidade" value={form.address.city} onChange={handleChange} fullWidth margin="normal" /> </Grid> <Grid item xs={12} md={6}> <TextField name="address.state" label="Estado" value={form.address.state} onChange={handleChange} fullWidth margin="normal" /> </Grid> <Grid item xs={12} md={6}> <TextField name="address.zip" label="CEP" value={form.address.zip} onChange={handleChange} fullWidth margin="normal" /> </Grid> </Grid> </DialogContent> <DialogActions> <Button onClick={onClose}>Cancelar</Button> <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button> </DialogActions> </Dialog> );}
function AvatarEditorDialog({ open, onClose, onSave }) { const [tab, setTab] = useState(0); const [imgSrc, setImgSrc] = useState(''); const [crop, setCrop] = useState(); const [completedCrop, setCompletedCrop] = useState(null); const [prompt, setPrompt] = useState(''); const [isGenerating, setIsGenerating] = useState(false); const [error, setError] = useState(''); const imgRef = useRef(null); const fileInputRef = useRef(null); function onImageLoad(e) { const { width, height } = e.currentTarget; const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height); setCrop(crop); } const handleFileChange = (e) => { if (e.target.files && e.target.files.length > 0) { setCrop(undefined); const reader = new FileReader(); reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || '')); reader.readAsDataURL(e.target.files[0]); } }; const handleGenerateAI = async () => { if (!prompt) return; setIsGenerating(true); setError(''); try { const response = await fetch('http://localhost:3002/api/generate-avatar', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ prompt }), }); if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Falha na resposta do servidor.'); } const data = await response.json(); const imageSrc = `data:image/png;base64,${data.imageBase64}`; setImgSrc(imageSrc); setTab(0); } catch (err) { setError(err.message || 'Ocorreu um erro. Tente novamente.'); console.error(err); } finally { setIsGenerating(false); } }; const handleSaveCroppedImage = async () => { if (!completedCrop || !imgRef.current) { return; } const image = imgRef.current; const canvas = document.createElement('canvas'); const scaleX = image.naturalWidth / image.width; const scaleY = image.naturalHeight / image.height; canvas.width = Math.floor(completedCrop.width * scaleX); canvas.height = Math.floor(completedCrop.height * scaleY); const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Could not get 2d context'); ctx.drawImage(image, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, canvas.width, canvas.height); const base64Image = canvas.toDataURL('image/jpeg'); onSave(base64Image); handleClose(); }; const handleClose = () => { setImgSrc(''); setPrompt(''); setError(''); setCompletedCrop(null); setCrop(undefined); onClose(); }; return ( <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth> <DialogTitle>Alterar Foto de Perfil</DialogTitle> <DialogContent sx={{ p: 0 }}> <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered variant="fullWidth"> <Tab icon={<CloudUpload />} label="Fazer Upload" /> <Tab icon={<AutoAwesome />} label="Gerar com IA" /> </Tabs> </Box> <Box sx={{ p: 3, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> {tab === 0 && ( <Stack spacing={2} alignItems="center"> {!imgSrc && (<Button variant="outlined" onClick={() => fileInputRef.current?.click()} startIcon={<PhotoCamera />}>Selecionar Imagem do Computador</Button>)} <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden /> {imgSrc && (<ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={1} circularCrop> <img ref={imgRef} alt="Crop" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '400px' }}/> </ReactCrop>)} </Stack> )} {tab === 1 && ( <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}> <Typography variant="body2" color="text.secondary" textAlign="center">Descreva como você quer seu novo avatar.</Typography> <TextField fullWidth multiline rows={2} label="Ex: A tiger with sun glasses (prompt deve ser em inglês)" value={prompt} onChange={(e) => setPrompt(e.target.value)} /> <Button variant="contained" onClick={handleGenerateAI} disabled={isGenerating || !prompt} startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}>{isGenerating ? 'Gerando...' : 'Gerar Imagem'}</Button> {error && <Alert severity="error">{error}</Alert>} </Stack> )} </Box> </DialogContent> <DialogActions> <Button onClick={handleClose}>Cancelar</Button> <Button onClick={handleSaveCroppedImage} variant="contained" disabled={!completedCrop && !imgSrc}>Salvar</Button> </DialogActions> </Dialog> );}

// ------------------ NOVO COMPONENTE: MODAL DE ALTERAR SENHA ------------------
function ChangePasswordDialog({ open, onClose, onSave }) {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleClose = () => {
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        setSuccess('');
        setLoading(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('A nova senha e a confirmação não correspondem.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            await onSave({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setSuccess('Senha alterada com sucesso!');
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao alterar a senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Alterar Senha
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <TextField
                        name="currentPassword"
                        label="Senha Atual"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading || !!success}
                    />
                    <TextField
                        name="newPassword"
                        label="Nova Senha"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading || !!success}
                    />
                    <TextField
                        name="confirmPassword"
                        label="Confirmar Nova Senha"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading || !!success}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading || !!success}>
                    {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// RESTANTE DOS COMPONENTES
const InfoListItem = ({ icon, primary, secondary }) => ( <ListItem> <ListItemIcon sx={{ color: 'primary.main', minWidth: '40px' }}>{icon}</ListItemIcon> <ListItemText primary={primary} secondary={secondary} primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.9rem' }} secondaryTypographyProps={{ color: 'text.primary', fontWeight: 'medium', fontSize: '1rem' }} /> </ListItem> );
const ProfileHeader = ({ profile, onEditAvatarClick, onEditProfileClick, loading }) => { const { user } = useUser(); const userAvatar = user?.avatar || profile?.avatar; const userName = profile?.name || user?.name || 'Usuário'; if (loading) { return ( <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 3 }}> <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} /> <Box> <Skeleton variant="text" width={200} height={40} /> <Skeleton variant="text" width={150} height={24} /> </Box> <Skeleton variant="rectangular" width={120} height={40} sx={{ ml: 'auto', borderRadius: '8px' }} /> </Paper> ); } return ( <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}> <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 3 }}> <Box sx={{ position: 'relative' }}> <Avatar src={userAvatar} sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.main', fontSize: '2.5rem' }}> {!userAvatar && userName.charAt(0).toUpperCase()} </Avatar> <IconButton size="small" onClick={onEditAvatarClick} sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', color: 'primary.main', border: '1px solid', borderColor: 'primary.main', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}> <PhotoCamera sx={{ fontSize: 16 }} /> </IconButton> </Box> <Box> <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>{userName}</Typography> <Typography variant="body1" sx={{ color: 'text.secondary' }}>ID do Cliente: {profile.id}</Typography> </Box> <Button variant="outlined" startIcon={<Edit />} onClick={onEditProfileClick} sx={{ ml: 'auto' }}> Editar Perfil </Button> </Paper> </motion.div> ); };
const InfoWidget = ({ title, children }) => ( <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}> <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{title}</Typography> {children} </Paper> );
const PersonalInfo = ({ profile }) => ( <InfoWidget title="Informações Pessoais"> <List dense> <InfoListItem icon={<Person />} primary="Nome Completo" secondary={profile.name} /> <Divider component="li" /> <InfoListItem icon={<CreditCard />} primary="Documento (CPF)" secondary={profile.document} /> <Divider component="li" /> <InfoListItem icon={<Mail />} primary="Email" secondary={profile.email} /> <Divider component="li" /> <InfoListItem icon={<CalendarToday />} primary="Data de Nascimento" secondary={profile.birthDate} /> </List> </InfoWidget> );
const AddressInfo = ({ profile }) => ( <InfoWidget title="Endereço"> <List dense> <InfoListItem icon={<LocationOn />} primary="País" secondary={profile.address.country || "Brasil"} /> <Divider component="li" /> <InfoListItem icon={<Business />} primary="Estado / Cidade" secondary={`${profile.address.state} / ${profile.address.city}`} /> <Divider component="li" /> <InfoListItem icon={<Home />} primary="Rua e CEP" secondary={`${profile.address.street}, ${profile.address.zip}`} /> </List> </InfoWidget> );
const AccountInfo = ({ profile }) => ( <InfoWidget title="Dados Bancários"> <List dense> <InfoListItem icon={<AccountBalance />} primary="Tipo de Conta" secondary={profile.account.type} /> <Divider component="li" /> <InfoListItem icon={<VpnKey />} primary="Agência / Conta" secondary={`${profile.account.agency} / ${profile.account.accountNumber}`} /> <Divider component="li" /> <InfoListItem icon={<CalendarToday />} primary="Cliente Desde" secondary={profile.account.memberSince} /> </List> </InfoWidget> );
// ------------------ COMPONENTE SecurityActions MODIFICADO ------------------
const SecurityActions = ({ onChangePasswordClick }) => {
    const navigate = useNavigate();
    const [isafeCode, setISafeCode] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => { let timer; if (countdown > 0) { timer = setInterval(() => { setCountdown(prev => prev - 1); }, 1000); } else if (countdown === 0 && isafeCode) { setISafeCode(null); localStorage.removeItem('isafeCode'); } return () => clearInterval(timer); }, [countdown, isafeCode]);
    const handleGenerateISafeCode = async () => { setLoading(true); try { await new Promise(resolve => setTimeout(resolve, 500)); const otp = Math.floor(100000 + Math.random() * 900000).toString(); localStorage.setItem('isafeCode', JSON.stringify({ code: otp, expiry: Date.now() + 300000 })); setISafeCode(otp); setCountdown(300); } catch (error) { console.error(error); } finally { setLoading(false); } };
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    return (
        <InfoWidget title="Segurança">
            <Stack spacing={2}>
                <Button variant="contained" startIcon={<Lock />} sx={{ justifyContent: 'flex-start', py: 1.5 }} onClick={onChangePasswordClick}>
                    Alterar Senha de Acesso
                </Button>
                <Button variant="outlined" startIcon={<Shield />} sx={{ justifyContent: 'flex-start', py: 1.5 }} onClick={() => navigate('/connected-devices')}>
                    Gerenciar Dispositivos Conectados
                </Button>
                <Button variant="outlined" startIcon={<PhoneAndroid />} sx={{ justifyContent: 'flex-start', py: 1.5 }} onClick={handleGenerateISafeCode} disabled={loading || !!isafeCode}>
                    {loading ? "Gerando..." : isafeCode ? "Código Ativo" : "Gerar Código iSafe"}
                </Button>
                {isafeCode && (
                    <Paper elevation={0} sx={{ p: 2, mt: 2, textAlign: 'center', background: theme => theme.palette.action.hover }}>
                        <Typography variant="h4" color="primary" sx={{ letterSpacing: '0.5rem', fontWeight: 'bold' }}>{isafeCode}</Typography>
                        <Typography variant="body2" color="text.secondary">Válido por: {formatTime(countdown)}</Typography>
                    </Paper>
                )}
            </Stack>
        </InfoWidget>
    );
};

// ------------------ COMPONENTE ProfilePage MODIFICADO ------------------
export default function ProfilePage() {
    const { user, updateUser } = useUser();
    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [isAvatarEditorOpen, setAvatarEditorOpen] = useState(false);
    useEffect(() => { const fetchProfileData = async () => { try { setLoading(true); setError(null); const email = user?.name; if (!email) { setLoading(false); setProfile(initialProfile); return; } const response = await fetch(`${API_URL}/customers/profile/${email}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); if (!response.ok) throw new Error(`Failed to fetch profile data: ${response.statusText}`); const data = await response.json(); const formattedBirthDate = data.birthDate ? new Date(data.birthDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : initialProfile.birthDate; const savedAvatar = localStorage.getItem('userAvatar'); const finalProfileData = { ...initialProfile, id: data.id || initialProfile.id, name: data.name || initialProfile.name, document: data.document || initialProfile.document, email: data.email || initialProfile.email, birthDate: formattedBirthDate, avatar: savedAvatar || data.avatar || initialProfile.avatar, address: { ...initialProfile.address, street: data.address?.street || initialProfile.address.street, city: data.address?.city || initialProfile.address.city, state: data.address?.state || initialProfile.address.state, zip: data.address?.zipCode || initialProfile.address.zip } }; setProfile(finalProfileData); if (updateUser) { updateUser({ name: finalProfileData.name, email: finalProfileData.email, avatar: finalProfileData.avatar }); } } catch (err) { console.error('Error fetching profile data:', err); setError(err.message || "Failed to load profile data."); setProfile(initialProfile); } finally { setLoading(false); } }; fetchProfileData(); }, [user?.name, updateUser]);
    const handleSaveProfile = (updatedData) => { setProfile(updatedData); if (updateUser) { updateUser({ name: localStorage.getItem('customerName'), email: updatedData.email }); } console.log("Saving to backend:", updatedData); };
    const handleSaveAvatar = (newAvatarUrl) => { if (updateUser) { updateUser({ avatar: newAvatarUrl }); } localStorage.setItem('userAvatar', newAvatarUrl); setProfile(prev => ({ ...prev, avatar: newAvatarUrl })); };
    const handleChangePassword = async (passwordData) => {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify(passwordData)
        });


        if (!response.ok) {
            // Tenta ler a resposta como JSON primeiro.
            let errorMessage = 'Falha ao alterar a senha. Verifique sua senha atual e tente novamente.';
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (jsonError) {
                try {
                    const textError = await response.text();
                    if (textError) {
                        errorMessage = textError.substring(0, 100);
                    }
                } catch (textError) {
                    errorMessage = `Erro no servidor: ${response.status} ${response.statusText}`;
                }
            }
            throw new Error(errorMessage);
        }
    };
    if (loading || !profile) { return ( <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}> <AppAppBar /> <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}> <Stack spacing={3}> <ProfileHeader loading={true} /> <Grid container spacing={3}> <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={250} sx={{ borderRadius: '16px' }} /></Grid> <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={250} sx={{ borderRadius: '16px' }} /></Grid> <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={250} sx={{ borderRadius: '16px' }} /></Grid> <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={250} sx={{ borderRadius: '16px' }} /></Grid> </Grid> </Stack> </Container> </Box> ); }
    if (error) { return ( <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}> <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} /> <Typography variant="h5" color="text.primary" gutterBottom>Erro ao Carregar Perfil</Typography> <Typography variant="body1" color="text.secondary">{error}</Typography> <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3 }}>Tentar Novamente</Button> </Box> ); }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppAppBar />
            <Container maxWidth="lg" sx={{ pt: '120px', pb: 4 }}>
                <Stack spacing={3}>
                    <ProfileHeader profile={profile} onEditAvatarClick={() => setAvatarEditorOpen(true)} onEditProfileClick={() => setOpenEdit(true)} loading={loading} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}> <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}> <PersonalInfo profile={profile} /> </motion.div> </Grid>
                        <Grid item xs={12} md={6}> <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}> <AddressInfo profile={profile} /> </motion.div> </Grid>
                        <Grid item xs={12} md={6}> <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}> <AccountInfo profile={profile} /> </motion.div> </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <SecurityActions onChangePasswordClick={() => setChangePasswordOpen(true)} />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Stack>
                <AvatarEditorDialog open={isAvatarEditorOpen} onClose={() => setAvatarEditorOpen(false)} onSave={handleSaveAvatar} />
                <EditProfileDialog open={openEdit} onClose={() => setOpenEdit(false)} data={profile} onSave={handleSaveProfile} />
                <ChangePasswordDialog
                    open={isChangePasswordOpen}
                    onClose={() => setChangePasswordOpen(false)}
                    onSave={handleChangePassword}
                />
            </Container>
        </Box>
    );
}