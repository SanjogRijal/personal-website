main = () => {
	const ghpages = require('gh-pages');
	
	ghpages.publish(
		'public',
		{
			branch: 'gh-pages',
			repo: 'https://github.com/SanjogRijal/personal-website',
			user: {
				name: 'SanjogRijal',
				email: 'sanjogrijal15@gmail.com'
			},
			dotfiles: false
		},
		() => {
			console.log('Deploy Complete');
		}
	)
}

main();
