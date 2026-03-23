'use client';

import LegalPage, { TermsContent } from '../../legacy-pages/LegalPage';

export default function Page() {
    return <LegalPage title="Términos Legales" lastUpdated="22 de Marzo, 2026" content={<TermsContent />} />;
}
