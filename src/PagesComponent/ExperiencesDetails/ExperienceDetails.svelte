<script>
	import Img from '../../Core_Components/ImageComponent/Image.svelte';
	import Details from '../../Core_Components/DetailsComponent/Details.svelte';
	let experienceDetails = [];

</script>

	
<style>
	.experience-detail-terakoya {
		position: relative;
		top: 2800px;
	}
	.experience-detail-vairav {
		position: relative;
		top: 3500px;
	}

	.experience-detail-sasoft{
		position: relative;
		top: 4200px;
	}

.experience-detail-krennova{
		position: relative;
		top: 4900px;
	}

	.experience-detail-leapfrog {
		position: relative;
		top: 5600px;
	}
	

</style>

<section>

	<div class = "experience-details-wrapper">
	<div class="experience-detail-terakoya">
		<Img src="/images/experience_details_terakoya.png" alt="Terakoya Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="Terakoya Academia" detailsSubheading = "Sr. Software Engineer" detailsBody = "Sr. Software Engineer | Team Lead | Software Architecture and Design | Project Management | Elasticsearch | Python | Angular" detailsFooter = "January 2022 - Present"/>	
	
	</div>
	</div>

	<div class = "experience-details-wrapper">
	<div class="experience-detail-vairav">
		<Img src="/images/experience_details_image_vairav.png" alt="Vairav Image" type = "coverPhoto"/>	
	 
		<Details detailsHeading ="Vairav Technology" detailsSubheading = "Software Engineer" detailsBody = "Elasticsearch | Logstash | Kibana | ReactJS | Hapi | NodeJS" detailsFooter = "January 2020 - January 2022"/>	
	
	</div>
	</div>	


<div class = "experience-details-wrapper">
	<div class="experience-detail-sasoft">
		<Img src="/images/experience_details_image_sasoft.png" alt="Sasoft Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="SASOFT PVT LTD." detailsSubheading = "Freelance Project Manager" detailsBody = "Office Setup | Office Management | Angular Development" detailsFooter = "2018-2019"/>	
	
	</div>
	</div>	

<div class = "experience-details-wrapper">
	<div class="experience-detail-krennova">
		<Img src="/images/experience_details_image_krennova.png" alt="Krennova Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="Software Engineer at Krennova" detailsSubheading = "Software Engineer" detailsBody = "MEAN Stack Software Engineer | Income/Expense Application | Management Information System | Video Streaming Platform - Prime time visualization | Print Sewa- Printing eCommerce Site" detailsFooter = "2017-2018"/>	
	
	</div>
</div>


	<div class = "experience-details-wrapper">
	<div class="experience-detail-leapfrog">
		<Img src="/images/experience_details_image_leapfrog.jpeg" alt="Leapfrog Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="Leapfrog Technology" detailsBody = "End To End Process | Software Development Lifecycle | Agile | Project Management | Quality Assurance" detailsFooter = "October 2019 - November 2019"/>	
	
	</div>
	</div>




</section>