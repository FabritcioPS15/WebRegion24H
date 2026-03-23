'use client';

import LegalPage, { PrivacyContent } from '../../legacy-pages/LegalPage';

export default function Page() {
    return <LegalPage title="Privacidad" lastUpdated="22 de Marzo, 2026" content={<PrivacyContent />} />;
}
