const Project = require('@project/Project');

module.exports = {
	async save(projectData, ejId) {
		const { name, description, tags, team, startDate, finishDate, contractLink, customer } = projectData;

		const project = await Project.create({
			name,
			description,
			tags,
			team,
			ej: ejId,
			startDate,
			finishDate,
			contractLink,
			customer
		})

		return getDTOproject(project);
	},

	// only for test purposes
	async findByEj(ejId) {
		// const ejs = await Ej.find().populate({ path: 'president', select: 'name -_id' });
		const projects = await Project.find({ ej: ejId }).populate({ path: 'team', select: 'name role _id' });;

		const projectsDTO = projects.map((project) => {
			return getDTOproject(project);
		});

		return projectsDTO;
	},

	async remove(projectId) {
		const project = await Project.deleteOne({ _id: projectId });
		return getDTOproject(project);
	},

	async update(projectId, data) {
		const updatedProject = await Project.findOneAndUpdate({ _id: projectId }, data)
		return getDTOproject(updatedProject);
	}
}

function getDTOproject(project) {
	return {
		_id: project._id,
		ej: project.ej,
		name: project.name,
		description: project.description,
		tags: project.tags,
		team: project.team,
		startDate: project.startDate,
		finishDate: project.finishDate,
		contractLink: project.contractLink,
		customer: project.customer,
      news: project.news
	};
}