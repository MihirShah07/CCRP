const logIp = (req, res, next) => {
    const userIp = req.ip || req.connection.remoteAddress;
    console.log(`User IP: ${userIp} visited ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
  };
  
module.exports = logIp;