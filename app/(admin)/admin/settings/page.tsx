export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Settings
        </h1>
        <p className="text-gray-600 text-sm">
          Configure your admin panel settings
        </p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-sm shadow-md p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Settings Coming Soon
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          This section will include site configuration, email settings, payment options, and more.
        </p>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Site name and logo</li>
            <li>• Business hours</li>
            <li>• Contact information</li>
            <li>• Social media links</li>
          </ul>
        </div>

        <div className="bg-white rounded-sm shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• SMTP configuration</li>
            <li>• Email templates</li>
            <li>• Notification preferences</li>
            <li>• Auto-reply messages</li>
          </ul>
        </div>

        <div className="bg-white rounded-sm shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Stripe configuration</li>
            <li>• Payment methods</li>
            <li>• Currency settings</li>
            <li>• Tax configuration</li>
          </ul>
        </div>

        <div className="bg-white rounded-sm shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Two-factor authentication</li>
            <li>• Session timeout</li>
            <li>• IP whitelist</li>
            <li>• Audit logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

