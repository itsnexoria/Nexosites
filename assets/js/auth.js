/* ================================================================
   auth.js — NexoSites
   Shared auth/session helpers. Requires supabase-client.js loaded
   first (window.sb must exist).
   ================================================================ */

const Auth = {
  _profileCache: null,

  async getSession() {
    const { data, error } = await window.sb.auth.getSession();
    if (error) return null;
    return data.session;
  },

  async getProfile(force = false) {
    if (this._profileCache && !force) return this._profileCache;
    const session = await this.getSession();
    if (!session) return null;
    const { data, error } = await window.sb
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (error) return null;
    this._profileCache = data;
    return data;
  },

  /** Redirects to /pages/login/ if not signed in. Returns the session or null. */
  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `/pages/login/?next=${next}`;
      return null;
    }
    return session;
  },

  /** Redirects to /pages/dashboard/ if not an admin. Returns the profile or null. */
  async requireAdmin() {
    const session = await this.requireAuth();
    if (!session) return null;
    const profile = await this.getProfile();
    if (!profile || profile.role !== 'admin') {
      window.location.href = '/pages/dashboard/';
      return null;
    }
    return profile;
  },

  async signOut() {
    await window.sb.auth.signOut();
    this._profileCache = null;
    window.location.href = '/';
  }
};

window.Auth = Auth;
