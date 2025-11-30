// components/admin/admin-sidebar.tsx
"use client"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Tableau de bord", icon: "fr-icon-dashboard-3-line" },
  { id: "factures", label: "Factures", icon: "fr-icon-file-text-line" },
  { id: "chiens", label: "Fiches chiens", icon: "fr-icon-user-heart-line" },
  { id: "messagerie", label: "Messagerie", icon: "fr-icon-mail-line" },
  { id: "emails", label: "Envoyer un email", icon: "fr-icon-send-plane-line" },
  { id: "rgpd", label: "Suppression RGPD", icon: "fr-icon-delete-line" },
]

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <nav className="fr-sidemenu" aria-label="Menu administration">
      <div className="fr-sidemenu__inner">
        <button 
          className="fr-sidemenu__btn" 
          hidden 
          aria-controls="fr-sidemenu-wrapper" 
          aria-expanded="false"
        >
          Menu
        </button>
        <div className="fr-collapse" id="fr-sidemenu-wrapper">
          <div className="fr-sidemenu__title">Navigation</div>
          <ul className="fr-sidemenu__list">
            {menuItems.map((item) => (
              <li 
                key={item.id} 
                className={`fr-sidemenu__item ${activeSection === item.id ? "fr-sidemenu__item--active" : ""}`}
              >
                <button
                  className="fr-sidemenu__link"
                  aria-current={activeSection === item.id ? "page" : undefined}
                  onClick={() => onSectionChange(item.id)}
                >
                  <span className={item.icon} aria-hidden="true"></span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}