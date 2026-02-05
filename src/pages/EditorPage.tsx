import AdminPanel from '../components/AdminPanel';

const EditorPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminPanel onBack={() => window.location.href = '/'} />
        </div>
    );
};

export default EditorPage;
