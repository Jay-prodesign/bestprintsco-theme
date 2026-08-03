# Exact Next Trigger

State: OWNER AUTHENTICATION REQUIRED

- Current system: Instagram authorization request opened from Meta Business Settings -> Best Prints Co. portfolio -> Instagram Accounts -> Add
- Exact blocker: Meta requires a direct account-holder confirmation on the button `bestprintsco_ olarak giriş yap`; automated activation did not proceed
- Correct owner: Gürkan Şenel
- Required owner action: in the already-open Instagram authorization tab, click `bestprintsco_ olarak giriş yap` once; do not choose `Hesap Değiştir`
- Safe fallback: leave the tab open; no additional disconnect, portfolio claim, Page connection, Commerce connection, ad publication, or spend occurs
- Continuation trigger: owner reports that the button was clicked and the authorization tab closed or returned to Meta
- Codex continuation cursor: refresh portfolio `913146750869963` Instagram Accounts, verify exact Instagram ID `17841401039012650`, reconnect Page `1153511934521436`, enable Inbox access, then attach Commerce Account `1995776851046152`
- Review condition: success requires the exact Instagram ID to appear in the BestPrintsCo portfolio; any password, 2FA, checkpoint, or identity request remains owner-only
- Terminal condition: Nstyled writes remain zero and live ad spend remains zero
