module.exports = {
  apps: [
    {
      name: 'IGS SKillViz User Service',
      cwd: './skillviz/igs-sv-services-develop/sv-usr-services/src',
      script: './index.js',
      env: {
	PORT: '5001',
	DB_URI: "mongodb://localhost:27017/igs_sv",
	DB_NAM: "igs_sv",
	CL_EMP: "sv_employees",
	CL_ANL: "sv_analytics",
	CL_MAS: "sv_master",
	CL_HIE: "sv_hierarchy"
      },
    },
    {
      name: 'IGS SKillViz Admin Service',
      cwd: './skillviz/igs-sv-services-develop/sv-admin-services/src',
      script: './index.js',
      env: {
	PORT: '5002',
	DB_URI: "mongodb://localhost:27017/igs_sv",
	DB_NAM: "igs_sv",
	CL_EMP: "sv_employees",
	CL_ANL: "sv_analytics",
	CL_MAS: "sv_master",
	CL_HIE: "sv_hierarchy"
      },
    },
  ],
}

