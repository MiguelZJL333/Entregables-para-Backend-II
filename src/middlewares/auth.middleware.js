// middleware sencillo para autorizar según rol
export const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'No autenticado' });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ status: 'error', message: 'No autorizado' });
        }
        next();
    };
};
