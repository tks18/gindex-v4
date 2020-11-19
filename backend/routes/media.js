const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const checkOrigin = require("../plugins/checkOrigin");
const jwtVerify = require('../plugins/jwtVerify');
const axios = require('axios');
const firstParser = require('../parsers/torrent-name-parser-one');
const secondParser = require('../parsers/torrent-name-parser-two');

//Model Imports
const User = require("../models/user");
const Settings = require("../models/siteSettings");

router.post('/generate', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			User.findOne({ email: req.body.email }, function(error, result){
					if(result){
						let mediaToken = jwt.sign({ result }, process.env.TOKENSECRET, {expiresIn: 10800});
						res.status(200).send({ auth: true, registered: true, token: mediaToken });
					} else {
						res.status(200).send({auth: false, registered: false, tokenuser: false});
					}
				})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/verify', function(req, res){
	if(checkOrigin(req.headers.origin)){
		User.findOne({ email: req.body.email }, function(error, result){
				if(result){
					jwt.verify(req.body.token, process.env.TOKENSECRET, function(error, decoded){
						if(decoded){
							res.status(200).send({ auth: true, registered: true, tokenuser: decoded });
						} else {
							res.status(200).send({auth: false, registered: false, tokenuser: null});
						}
					});
				} else {
					res.status(200).send({auth: false, registered: false, tokenuser: false});
				}
			})
	} else {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

router.post('/data', function(req, res){
	if(checkOrigin(req.headers.origin)){
		if(jwtVerify(req.headers.token)){
			Settings.findOne({ cId: process.env.FRONTENDSITENAME }, function(error, settingsData){
				if(!settingsData || settingsData.tmdb){
					User.findOne({ email: req.body.email }, function(error, result){
						if(result){
							try {
								const firstParsed = firstParser.parse(req.body.title);
								const titleRegex = /^[^<>:;,?\[\]\(\)@`~!#$%^+=}{|.\\_\-"*|/]+$/
								var parsed;
								let searchPoint = {
									tv: "https://api.themoviedb.org/3/search/tv",
									movie: "https://api.themoviedb.org/3/search/movie",
								};
								let dataEndPoint = {
									tv: "https://api.themoviedb.org/3/tv",
									movie: "https://api.themoviedb.org/3/movie",
								};
								let mediaEndPoint = {
									image: "https://image.tmdb.org/t/p/w500",
									video: "https://www.youtube.com/watch?v=",
								}
								let imageKey = "https://image.tmdb.org/t/p/w500";
								let videoKey = "https://www.youtube.com/watch?v=";
								if(titleRegex.test(firstParsed.title)){
									parsed = firstParsed;
								} else {
									const secondParsed = secondParser(req.body.title);
									parsed = secondParsed;
								}
								if(parsed.title){
									if(parsed.season){
										axios.get(`${searchPoint.tv}?api_key=${process.env.TMDBAPI}&page=1&query=${encodeURI(parsed.title.toLowerCase())}&include_adult=false`).then(response => {
											if(response.data.results.length < 1){
												axios.get(`${searchPoint.movie}?api_key=${process.env.TMDBAPI}&query=${encodeURI(parsed.title.toLowerCase())}&page=1&include_adult=false&primary_release_year=${parsed.year}`).then(response => {
													if(response.data.results.length < 1){
														res.status(200).send({ auth: true, registered: true, data: false });
													} else {
														axios.get(`${dataEndPoint.movie}/${response.data.results[0].id}?api_key=${process.env.TMDBAPI}&append_to_response=videos,images,reviews,people,networks,companies,collections,credits`).then(response => {
															let resp = response.data;
															if(resp.created_by){
																resp.created_by.forEach((item, i) => {
																	if(item.profile_path && item.profile_path != null){
																		resp.created_by[i].profile_path = mediaEndPoint.image+item.profile_path;
																	}
																});
															}
															if(resp.belongs_to_collection){
																resp.belongs_to_collection.poster_path = mediaEndPoint.image+resp.belongs_to_collection.poster_path;
																resp.belongs_to_collection.backdrop_path = mediaEndPoint.image+resp.belongs_to_collection.backdrop_path;
															}
															if(resp.revenue){
																resp.revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.revenue);
															}
															if(resp.budget){
																resp.budget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.budget);
															}
															if(resp.networks){
																resp.networks.forEach((item, i) => {
																	if(item.logo_path && item.logo_path != null){
																		resp.networks[i].logo_path = mediaEndPoint.image+item.logo_path;
																	}
																});
															}
															if(resp.backdrop_path){
																resp.backdrop_path = mediaEndPoint.image+resp.backdrop_path;
															}
															if(resp.poster_path){
																resp.poster_path = mediaEndPoint.image+resp.poster_path;
															}
															if(resp.production_companies){
																resp.production_companies.forEach((item, i) => {
																	if(item.logo_path && item.logo_path != null){
																		resp.production_companies[i].logo_path = mediaEndPoint.image+item.logo_path;
																	}
																});
															}
															if(resp.videos){
																resp.videos.results.forEach((item, i) => {
																	if(item.key && item.key != null){
																		resp.videos.results[i].key = mediaEndPoint.video+item.key;
																	}
																});
															}
															if(resp.images){
																if(resp.images.backdrops.length > 0){
																	resp.images.backdrops.forEach((item, i) => {
																		if(item.file_path && item.file_path != null){
																			resp.images.backdrops[i].file_path = mediaEndPoint.image+item.file_path;
																		}
																	});
																}
																if(resp.images.posters.length > 0){
																	resp.images.posters.forEach((item, i) => {
																		if(item.file_path && item.file_path != null){
																			resp.images.posters[i].file_path = mediaEndPoint.image+item.file_path;
																		}
																	});
																}
															}
															if(resp.credits){
																if(resp.credits.cast){
																	resp.credits.cast.forEach((item, i) => {
																		if(item.profile_path && item.profile_path != null){
																			resp.credits.cast[i].profile_path = mediaEndPoint.image+item.profile_path;
																		}
																	});
																}
																if(resp.credits.crew){
																	resp.credits.crew.forEach((item, i) => {
																		if(item.profile_path && item.profile_path != null){
																			resp.credits.crew[i].profile_path = mediaEndPoint.image+item.profile_path;
																		}
																	});
																}
															}
															res.status(200).send({ auth: true, registered: true, data: true, result: resp, parsedData: parsed });
														})
													}
												})
											} else {
												axios.get(`${dataEndPoint.tv}/${response.data.results[0].id}?api_key=${process.env.TMDBAPI}&append_to_response=videos,images,reviews,people,networks,companies,collections,credits`).then(response => {
													let resp = response.data;
													if(resp.created_by){
														resp.created_by.forEach((item, i) => {
															if(item.profile_path && item.profile_path != null){
																resp.created_by[i].profile_path = mediaEndPoint.image+item.profile_path;
															}
														});
													}
													if(resp.belongs_to_collection){
														resp.belongs_to_collection.poster_path = mediaEndPoint.image+resp.belongs_to_collection.poster_path;
														res.resp.belongs_to_collection.backdrop_path = mediaEndPoint.image+res.resp.belongs_to_collection.backdrop_path;
													}
													if(resp.last_episode_to_air){
														resp.last_episode_to_air.still_path = mediaEndPoint.image+resp.last_episode_to_air.still_path
													}
													if(resp.networks){
														resp.networks.forEach((item, i) => {
															if(item.logo_path && item.logo_path != null){
																resp.networks[i].logo_path = mediaEndPoint.image+item.logo_path;
															}
														});
													}
													if(resp.revenue){
														resp.revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.revenue);
													}
													if(resp.budget){
														resp.budget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.budget);
													}
													if(resp.seasons){
														resp.seasons.forEach((item, i) => {
															if(item.poster_path && item.poster_path != null){
																resp.seasons[i].poster_path = mediaEndPoint.image+item.poster_path;
															}
														});
													}
													if(resp.backdrop_path){
														resp.backdrop_path = mediaEndPoint.image+resp.backdrop_path;
													}
													if(resp.poster_path){
														resp.poster_path = mediaEndPoint.image+resp.poster_path;
													}
													if(resp.production_companies){
														resp.production_companies.forEach((item, i) => {
															if(item.logo_path && item.logo_path != null){
																resp.production_companies[i].logo_path = mediaEndPoint.image+item.logo_path;
															}
														});
													}
													if(resp.videos){
														resp.videos.results.forEach((item, i) => {
															if(item.key && item.key != null){
																resp.videos.results[i].key = mediaEndPoint.video+item.key;
															}
														});
													}
													if(resp.images){
														if(resp.images.backdrops.length > 0){
															resp.images.backdrops.forEach((item, i) => {
																if(item.file_path && item.file_path != null){
																	resp.images.backdrops[i].file_path = mediaEndPoint.image+item.file_path;
																}
															});
														}
														if(resp.images.posters.length > 0){
															resp.images.posters.forEach((item, i) => {
																if(item.file_path && item.file_path != null){
																	resp.images.posters[i].file_path = mediaEndPoint.image+item.file_path;
																}
															});
														}
													}
													if(resp.credits){
														if(resp.credits.cast){
															resp.credits.cast.forEach((item, i) => {
																if(item.profile_path && item.profile_path != null){
																	resp.credits.cast[i].profile_path = mediaEndPoint.image+item.profile_path;
																}
															});
														}
														if(resp.credits.crew){
															resp.credits.crew.forEach((item, i) => {
																if(item.profile_path && item.profile_path != null){
																	resp.credits.crew[i].profile_path = mediaEndPoint.image+item.profile_path;
																}
															});
														}
													}
													res.status(200).send({ auth: true, registered: true, data: true, result: resp, parsedData: parsed });
												})
											}
										})
									} else {
										axios.get(`${searchPoint.movie}?api_key=${process.env.TMDBAPI}&query=${encodeURI(parsed.title.toLowerCase())}&page=1&include_adult=false&primary_release_year=${parsed.year}`).then(response => {
											if(response.data.results.length < 1){
												axios.get(`${searchPoint.tv}?api_key=${process.env.TMDBAPI}&page=1&query=${encodeURI(parsed.title.toLowerCase())}&include_adult=false`).then(response => {
													if(response.data.results.length < 1){
														res.status(200).send({ auth: true, registered: true, data: false });
													} else {
														axios.get(`${dataEndPoint.tv}/${response.data.results[0].id}?api_key=${process.env.TMDBAPI}&append_to_response=videos,images,reviews,people,networks,companies,collections,credits`).then(response => {
															let resp = response.data;
															if(resp.created_by){
																resp.created_by.forEach((item, i) => {
																	if(item.profile_path && item.profile_path != null){
																		resp.created_by[i].profile_path = mediaEndPoint.image+item.profile_path;
																	}
																});
															}
															if(resp.belongs_to_collection){
																resp.belongs_to_collection.poster_path = mediaEndPoint.image+resp.belongs_to_collection.poster_path;
																res.resp.belongs_to_collection.backdrop_path = mediaEndPoint.image+res.resp.belongs_to_collection.backdrop_path;
															}
															if(resp.last_episode_to_air){
																resp.last_episode_to_air.still_path = mediaEndPoint.image+resp.last_episode_to_air.still_path
															}
															if(resp.networks){
																resp.networks.forEach((item, i) => {
																	if(item.logo_path && item.logo_path != null){
																		resp.networks[i].logo_path = mediaEndPoint.image+item.logo_path;
																	}
																});
															}
															if(resp.revenue){
																resp.revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.revenue);
															}
															if(resp.budget){
																resp.budget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.budget);
															}
															if(resp.seasons){
																resp.seasons.forEach((item, i) => {
																	if(item.poster_path && item.poster_path != null){
																		resp.seasons[i].poster_path = mediaEndPoint.image+item.poster_path;
																	}
																});
															}
															if(resp.backdrop_path){
																resp.backdrop_path = mediaEndPoint.image+resp.backdrop_path;
															}
															if(resp.poster_path){
																resp.poster_path = mediaEndPoint.image+resp.poster_path;
															}
															if(resp.production_companies){
																resp.production_companies.forEach((item, i) => {
																	if(item.logo_path && item.logo_path != null){
																		resp.production_companies[i].logo_path = mediaEndPoint.image+item.logo_path;
																	}
																});
															}
															if(resp.videos){
																resp.videos.results.forEach((item, i) => {
																	if(item.key && item.key != null){
																		resp.videos.results[i].key = mediaEndPoint.video+item.key;
																	}
																});
															}
															if(resp.images){
																if(resp.images.backdrops.length > 0){
																	resp.images.backdrops.forEach((item, i) => {
																		if(item.file_path && item.file_path != null){
																			resp.images.backdrops[i].file_path = mediaEndPoint.image+item.file_path;
																		}
																	});
																}
																if(resp.images.posters.length > 0){
																	resp.images.posters.forEach((item, i) => {
																		if(item.file_path && item.file_path != null){
																			resp.images.posters[i].file_path = mediaEndPoint.image+item.file_path;
																		}
																	});
																}
															}
															if(resp.credits){
																if(resp.credits.cast){
																	resp.credits.cast.forEach((item, i) => {
																		if(item.profile_path && item.profile_path != null){
																			resp.credits.cast[i].profile_path = mediaEndPoint.image+item.profile_path;
																		}
																	});
																}
																if(resp.credits.crew){
																	resp.credits.crew.forEach((item, i) => {
																		if(item.profile_path && item.profile_path != null){
																			resp.credits.crew[i].profile_path = mediaEndPoint.image+item.profile_path;
																		}
																	});
																}
															}
															res.status(200).send({ auth: true, registered: true, data: true, result: resp, parsedData: parsed });
														})
													}
												})
											} else {
												axios.get(`${dataEndPoint.movie}/${response.data.results[0].id}?api_key=${process.env.TMDBAPI}&append_to_response=videos,images,reviews,people,networks,companies,collections,credits`).then(response => {
													let resp = response.data;
													if(resp.created_by){
														resp.created_by.forEach((item, i) => {
															if(item.profile_path && item.profile_path != null){
																resp.created_by[i].profile_path = mediaEndPoint.image+item.profile_path;
															}
														});
													}
													if(resp.belongs_to_collection){
														resp.belongs_to_collection.poster_path = mediaEndPoint.image+resp.belongs_to_collection.poster_path;
														resp.belongs_to_collection.backdrop_path = mediaEndPoint.image+resp.belongs_to_collection.backdrop_path;
													}
													if(resp.revenue){
														resp.revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.revenue);
													}
													if(resp.budget){
														resp.budget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 8 }).format(resp.budget);
													}
													if(resp.networks){
														resp.networks.forEach((item, i) => {
															if(item.logo_path && item.logo_path != null){
																resp.networks[i].logo_path = mediaEndPoint.image+item.logo_path;
															}
														});
													}
													if(resp.backdrop_path){
														resp.backdrop_path = mediaEndPoint.image+resp.backdrop_path;
													}
													if(resp.poster_path){
														resp.poster_path = mediaEndPoint.image+resp.poster_path;
													}
													if(resp.production_companies){
														resp.production_companies.forEach((item, i) => {
															if(item.logo_path && item.logo_path != null){
																resp.production_companies[i].logo_path = mediaEndPoint.image+item.logo_path;
															}
														});
													}
													if(resp.videos){
														resp.videos.results.forEach((item, i) => {
															if(item.key && item.key != null){
																resp.videos.results[i].key = mediaEndPoint.video+item.key;
															}
														});
													}
													if(resp.images){
														if(resp.images.backdrops.length > 0){
															resp.images.backdrops.forEach((item, i) => {
																if(item.file_path && item.file_path != null){
																	resp.images.backdrops[i].file_path = mediaEndPoint.image+item.file_path;
																}
															});
														}
														if(resp.images.posters.length > 0){
															resp.images.posters.forEach((item, i) => {
																if(item.file_path && item.file_path != null){
																	resp.images.posters[i].file_path = mediaEndPoint.image+item.file_path;
																}
															});
														}
													}
													if(resp.credits){
														if(resp.credits.cast){
															resp.credits.cast.forEach((item, i) => {
																if(item.profile_path && item.profile_path != null){
																	resp.credits.cast[i].profile_path = mediaEndPoint.image+item.profile_path;
																}
															});
														}
														if(resp.credits.crew){
															resp.credits.crew.forEach((item, i) => {
																if(item.profile_path && item.profile_path != null){
																	resp.credits.crew[i].profile_path = mediaEndPoint.image+item.profile_path;
																}
															});
														}
													}
													res.status(200).send({ auth: true, registered: true, data: true, result: resp, parsedData: parsed });
												})
											}
										})
									}
								} else {
									res.status(200).send({ auth: true, registered: true, data: false });
								}
							} catch(e) {
								res.status(200).send({ auth: true, registered: true, data: false, message: e });
							}
						} else {
							res.status(200).send({auth: false, registered: false, message: "You are Unauthorised"});
						}
					})
				} else {
					res.status(200).send({ auth: true, registered: true, data: false, message: "TMDB has been Turned Off." });
				}
			})
		} else {
			res.status(200).send({ auth: false, message: "Bearer Token Not Valid" })
		}
	} else  {
		res.status(200).send({ auth: false, message: "UNAUTHORIZED" })
	}
})

module.exports = router;
