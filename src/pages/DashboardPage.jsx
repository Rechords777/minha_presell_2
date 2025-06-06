import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPresells, deletePresell } from '../services/api';

// Get the base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DashboardPage() {
  const [presells, setPresells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresells = async () => {
      try {
        setLoading(true);
        const data = await getPresells();
        // Ensure slug is included in the fetched data
        setPresells(data.map(p => ({ ...p, slug: p.slug || '' }))); // Add default empty slug if missing
        setError('');
      } catch (err) {
        console.error('Failed to fetch presells:', err);
        setError('Falha ao carregar as pré-vendas. Tente novamente mais tarde.');
        // If unauthorized (e.g., token expired), redirect to login (assuming no auth now)
        // if (err.response && err.response.status === 403) {
        //   localStorage.removeItem('accessToken');
        //   navigate('/login');
        // }
      } finally {
        setLoading(false);
      }
    };
    fetchPresells();
  }, [navigate]);

  const handleDelete = async (presellId) => {
    if (window.confirm('Tem certeza que deseja excluir esta pré-venda?')) {
      try {
        await deletePresell(presellId);
        setPresells(presells.filter(p => p.id !== presellId));
      } catch (err) {
        console.error('Failed to delete presell:', err);
        setError('Falha ao excluir a pré-venda.');
      }
    }
  };

  const handleEdit = (presellId) => {
    navigate(`/presells/edit/${presellId}`);
  };

  const handleView = (slug) => {
    if (!API_BASE_URL) {
      console.error("VITE_API_BASE_URL is not defined!");
      alert('Erro de configuração: URL base da API não encontrada.');
      return;
    }
    if (slug) {
      // Construct the full URL pointing to the backend view endpoint
      const viewUrl = `${API_BASE_URL}/presells/view/${slug}`;
      console.log("Opening view URL:", viewUrl); // Log the URL for debugging
      window.open(viewUrl, '_blank');
    } else {
      alert('Slug da pré-venda não disponível para visualização.');
    }
  };

  const handleCopyUrl = (slug) => {
     if (!API_BASE_URL) {
      console.error("VITE_API_BASE_URL is not defined!");
      alert('Erro de configuração: URL base da API não encontrada para cópia.');
      return;
    }
    if (slug) {
      const viewUrl = `${API_BASE_URL}/presells/view/${slug}`;
      navigator.clipboard.writeText(viewUrl)
        .then(() => alert('URL de visualização copiada para a área de transferência!'))
        .catch(err => {
            console.error('Falha ao copiar URL: ', err);
            alert('Falha ao copiar URL.');
        });
    } else {
      alert('Slug da pré-venda não disponível para cópia.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando pré-vendas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 sm:mb-0">Minhas Pré-vendas</h1>
        <Link
          to="/presells/new"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          + Criar Nova Pré-venda
        </Link>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      {presells.length === 0 && !loading && (
        <div className="text-center text-gray-500 p-6 bg-white shadow-md rounded-lg">
          <p className="text-xl mb-2">Nenhuma pré-venda encontrada.</p>
          <p>Clique em "Criar Nova Pré-venda" para começar.</p>
        </div>
      )}

      {presells.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Idioma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">URL Pública</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presells.map((presell) => (
                <tr key={presell.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{presell.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presell.presell_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presell.language_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Pass slug to handleCopyUrl */}
                    {presell.slug ? (
                      <button
                        onClick={() => handleCopyUrl(presell.slug)}
                        className="text-blue-600 hover:text-blue-800 underline mr-2"
                        title="Copiar URL de Visualização"
                      >
                        Copiar
                      </button>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${presell.status === 'publicada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {presell.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                     {/* Pass slug to handleView */}
                    <button onClick={() => handleView(presell.slug)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="Visualizar">
                      Ver
                    </button>
                    <button onClick={() => handleEdit(presell.id)} className="text-yellow-600 hover:text-yellow-900 mr-3" title="Editar">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(presell.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

