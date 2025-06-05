import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPresell, getPresellById, updatePresell } from '../services/api';

function PresellFormPage() {
  const [name, setName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [presellType, setPresellType] = useState('cookies'); // Default type
  const [languageCode, setLanguageCode] = useState('pt'); // Default language
  const [slug, setSlug] = useState(''); // Changed from slugUrl to slug for consistency
  const [customBackgroundImageUrl, setCustomBackgroundImageUrl] = useState(''); // New state for custom background
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { id: presellId } = useParams(); // For editing
  const isEditing = Boolean(presellId);

  const presellTypes = [
    { value: 'cookies', label: 'Banner de Cookies' },
    { value: 'sexo', label: 'Verificação de Sexo' },
    { value: 'idade', label: 'Verificação de Idade' },
    { value: 'fantasma', label: 'Página Fantasma (Clone Simples)' },
    { value: 'pais', label: 'Verificação de País' },
    // Adicionar mais tipos conforme necessário
  ];

  const languages = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'Inglês' },
    { value: 'es', label: 'Espanhol' },
    // Adicionar mais idiomas conforme necessário
    // TODO: Populate this list dynamically from backend langs folder?
  ];

  useEffect(() => {
    if (isEditing && presellId) {
      const fetchPresellData = async () => {
        setIsLoading(true);
        try {
          const data = await getPresellById(presellId);
          setName(data.name);
          setProductUrl(data.product_url);
          setAffiliateLink(data.affiliate_link);
          setPresellType(data.presell_type);
          setLanguageCode(data.language_code);
          setSlug(data.slug); // Update to use slug
          setCustomBackgroundImageUrl(data.custom_background_image_url || ''); // Fetch custom background URL
          setError('');
        } catch (err) {
          console.error('Failed to fetch presell data for editing:', err);
          setError('Falha ao carregar dados da pré-venda para edição.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPresellData();
    }
  }, [presellId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const presellData = {
      name,
      product_url: productUrl,
      affiliate_link: affiliateLink,
      presell_type: presellType,
      language_code: languageCode,
      slug: slug, // Use the correct state variable
      custom_background_image_url: customBackgroundImageUrl || null, // Send custom URL or null
      // status will be set by backend, owner_id will be set by backend based on token
    };

    try {
      if (isEditing) {
        await updatePresell(presellId, presellData);
        setSuccessMessage('Pré-venda atualizada com sucesso!');
      } else {
        await createPresell(presellData);
        setSuccessMessage('Pré-venda criada com sucesso!');
      }
      // Optionally, redirect after a short delay or provide a link back
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to save presell:', err);
      setError(err.response?.data?.detail || 'Falha ao salvar a pré-venda. Verifique os campos e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return <div className="p-4 text-center">Carregando dados da pré-venda...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        {isEditing ? 'Editar Pré-venda' : 'Criar Nova Pré-venda'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{successMessage}</p>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome da Pré-venda</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="productUrl" className="block text-gray-700 text-sm font-bold mb-2">URL do Produto (para screenshot)</label>
          <input
            type="url"
            id="productUrl"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://www.exemploproduto.com"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="affiliateLink" className="block text-gray-700 text-sm font-bold mb-2">Link de Afiliado</label>
          <input
            type="url"
            id="affiliateLink"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://seu.link.afiliado.com/produto"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="presellType" className="block text-gray-700 text-sm font-bold mb-2">Tipo de Pré-venda</label>
          <select
            id="presellType"
            value={presellType}
            onChange={(e) => setPresellType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {presellTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="languageCode" className="block text-gray-700 text-sm font-bold mb-2">Idioma da Pré-venda</label>
          <select
            id="languageCode"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select> {/* Corrected closing tag here */}
        </div>

        {/* New field for Custom Background Image URL */}
        <div className="mb-4">
          <label htmlFor="customBackgroundImageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem de Fundo Personalizada (Opcional)</label>
          <input
            type="url"
            id="customBackgroundImageUrl"
            value={customBackgroundImageUrl}
            onChange={(e) => setCustomBackgroundImageUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://exemplo.com/imagem.jpg (deixe em branco para usar o padrão)"
          />
          <p className="text-xs text-gray-600 mt-1">Cole a URL de uma imagem para usar como fundo. Se deixado em branco, um fundo padrão será usado.</p>
        </div>

        <div className="mb-6">
          <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">Slug da URL (ex: meu-produto-incrivel)</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="meu-produto-incrivel"
            required
          />
        </div> {/* Corrected closing tag here */}

        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto mb-2 sm:mb-0"
            disabled={isLoading}
          >
            {isLoading ? (isEditing ? 'Atualizando...' : 'Criando...') : (isEditing ? 'Atualizar Pré-venda' : 'Criar Pré-venda')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto sm:ml-4"
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PresellFormPage;

