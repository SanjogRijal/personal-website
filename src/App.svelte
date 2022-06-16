<script>
	
import About from './PagesComponent/About/About.svelte';
import Navbar from './PagesComponent/Navbar/navbar.svelte';
import Container from './Core_Components/ContainerComponent/Containers.svelte';
import EducationDetails from './PagesComponent/EducationDetails/EducationDetails.svelte';
import ExperienceDetails from './PagesComponent/ExperiencesDetails/ExperienceDetails.svelte';
import BackToTop from './Core_Components/BackToTop/BackToTop.svelte';


</script>



<main>

	<div class="nav-bar">
			<Navbar/>
		</div>

	<Container>
		<div class="about">
			<About/>	
		</div>
	</Container>

	<Container>
		<div class="education-details">
			<EducationDetails/>
		</div>
	</Container>

	<Container>
		<div class="experience-details">
			<ExperienceDetails/>
		</div>
	</Container>

	<BackToTop></BackToTop>

</main>


<style>

.nav-bar {
    top: 20px;
    position: relative;
    padding: 13px 3%;
    background-color: #acacac69;   
}

@media (min-width: 640px) {
	main {
		max-width: none;
	}
}
	/*/For Tablets*/
@media screen and (min-width: 300px) {
    .nav-bar {
    	left: 53px;;
    }
}


@media screen and (min-width: 768px) {
	.nav-bar {
	    left: 202px;
	}
}

@media screen and (min-width: 992px) {
/*//For Large Laptops*/
    .nav-bar {
        left: 202px;
    }
}
/*//For Big TV's (HD Screens) */

@media screen and (min-width: 1279px) {

    .nav-bar {
        left: 0px;
    }
}

@media screen and (min-width: 1800px) {

    .nav-bar {
        left: 456px;
    }
}

</style>