import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPresells, deletePresell } from '../services/api';

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
        setPresells(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch presells:', err);
        setError('Falha ao carregar as pré-vendas. Tente novamente mais tarde.');
        // If unauthorized (e.g., token expired), redirect to login
        if (err.response && err.response.status === 403) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
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

  const handleView = (publicUrl) => {
    if (publicUrl) {
      // Assuming publicUrl is relative to the backend API base URL or a full URL
      // For MVP, if it's a relative path like /static_presells/html/..., construct full URL
      // const backendBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
      // For now, let's assume it's a full URL or a path that the browser can resolve relative to the current domain if backend serves it.
      // If the public_url is like /static_presells/..., it needs to be prefixed by the backend URL.
      // For now, let's just open it. This might need adjustment based on actual public_url format.
      window.open(publicUrl, '_blank');
    } else {
      alert('URL pública não disponível.');
    }
  };
  
  const handleCopyUrl = (url) => {
    if (url) {
      navigator.clipboard.writeText(url)
        .then(() => alert('URL copiada para a área de transferência!'))
        .catch(err => {
            console.error('Falha ao copiar URL: ', err);
            alert('Falha ao copiar URL.');
        });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando pré-vendas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Minhas Pré-vendas</h1>
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
                    {presell.public_url ? (
                      <button 
                        onClick={() => handleCopyUrl(presell.public_url)} 
                        className="text-blue-600 hover:text-blue-800 underline mr-2"
                        title="Copiar URL"
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
                    <button onClick={() => handleView(presell.public_url)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="Visualizar">
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

