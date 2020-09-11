<template>
  <div :class="ismobile ? 'content nopad mt-2 mx-2 px-2 mt-2' : 'content nopad mt-2 mt-2 ml-5 mr-5'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div v-show="infoPanel" class="columns is-multiline is-centered is-vcentered">
      <div v-if="dataPresent" class="column is-full">
        <div class="columns is-multiline is-vcentered">
          <div class="column is-half">
            <div class="columns is-multiline is-desktop is-centered is-vcentered">
              <div class="column is-two-thirds">
                <figure class="image is-100x150">
                  <img v-lazy="videoData.poster_path">
                </figure>
              </div>
              <div v-if="ismobile" class="column has-text-centered is-full">
                <button class="button is-netflix-red is-rounded mx-2" @click="tapPlay">
                  <span class="icon">
                    <i class="fas fa-play"></i>
                  </span>
                  <span>Play Now</span>
                </button>
                <button class="button is-netflix-red is-rounded mx-2" @click="playOutside(videoData.videos.results[0].key)">
                  <span class="icon">
                    <i class="fas fa-tv"></i>
                  </span>
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
          <div class="column is-half">
            <div class="columns is-multiline is-desktop is-mobile is-vcentered">
              <div class="column is-full mt-6 py-0 my-1">
                <h1 class="title has-text-white has-text-bold">
                  {{ videoData.title || videoData.original_title || videoData.name || videoData.original_name || videoname }}
                </h1>
              </div>
              <div v-if="videoData.runtime || videoData.episode_run_time" class="column is-full my-0">
                <div class="columns is-mobile is-multiline is-desktop">
                  <div class="column is-one-third">
                    <p class="subtitle has-text-netflix-only has-text-weight-bold">
                      <span class="icon has-text-success">
                        <i class="fas fa-clock"></i>
                      </span>
                      {{ videoData.runtime || videoData.episode_run_time[0] }}{{ videoData.runtime ? " Minutes" : videoData.episode_run_time[0] ? " Avg. Minutes" : " " }}
                    </p>
                  </div>
                  <div v-if="videoData.vote_average" class="column is-one-third">
                    <p class="subtitle has-text-netflix-only has-text-weight-bold">
                      <span class="icon has-text-warning">
                        <i class="fab fa-imdb"></i>
                      </span>
                      {{ videoData.vote_average }}<span class="has-text-grey">/</span>10
                    </p>
                  </div>
                  <div v-if="videoData.vote_count" class="column is-one-third">
                    <p class="subtitle has-text-netflix-only has-text-weight-bold">
                      <span class="icon has-text-primary">
                        <i class="fas fa-poll"></i>
                      </span>
                      {{ videoData.vote_count }} Votes
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="videoData.overview" class="column is-full my-0 py-0">
                <h6 class="subtitle has-text-grey has-text-bold">
                  Overview
                </h6>
              </div>
              <div v-if="videoData.overview" class="column is-full mt-1 mb-2 pt-0 px-3">
                <p class="subtitle has-text-light is-6">
                  {{ videoData.overview }}
                </p>
              </div>
              <div v-if="videoData.genres && videoData.genres.length != 0" class="column is-full mt-2 pt-0 px-3">
                <div class="columns is-desktop is-mobile is-multiline is-vcentered">
                  <div class="column is-full my-0 mb-0 py-0">
                    <h6 class="subtitle has-text-grey has-text-bold">
                      Genres
                    </h6>
                  </div>
                  <div class="column is-full my-0 py-1">
                    <span v-for="(genre, index) in videoData.genres" v-bind:key="index" class="has-text-netflix-only">{{ index == videoData.genres.length -1 ? genre.name : genre.name+", " }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!ismobile" class="column is-full">
                <button class="button is-netflix-red is-rounded mx-2" @click="tapPlay">
                  <span class="icon">
                    <i class="fas fa-play"></i>
                  </span>
                  <span>Play Now</span>
                </button>
                <button class="button is-netflix-red is-rounded mx-2" @click="playOutside(videoData.videos.results[0].key)">
                  <span class="icon">
                    <i class="fas fa-tv"></i>
                  </span>
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="column is-full">
        <h5 class="subtitle has-text-white has-text-centered">
          Wait till the Data is Being Retrieved
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse"></i>
          </span>
        </h5>
      </div>
    </div>
    <div v-show="!infoPanel" class="columns is-multiline is-centered">
      <div :class="ismobile ? 'column is-full mx-0 px-1' : 'column is-two-thirds'">
        <div class="columns is-desktop is-multiline is-centered">
          <div class="column is-full">
            <div class="columns is-multiline is-desktop is-vcentered">
              <div class="column is-full mb-0 pb-0">
                <div class="has-text-right is-small">
                  <span class="icon has-text-netflix-only is-medium">
                    <i :class="playicon"></i>
                  </span>
                  <span class="subtitle has-text-netflix-only">{{ playtext }}</span>
                </div>
              </div>
              <div class="column is-full mt-0 pt-1">
                <vue-plyr ref="plyr" v-bind:key="videokey" class="my-2">
                  <video :poster="poster" :src="apiurl" class="video-content">
                    <source :src="apiurl" type="video/mp4" size="Original Format">
                    <track v-for="(sub, index) in suburl" kind="captions" :label="sub.label" :src="sub.url" :srclang="sub.label" v-bind:key="index">
                  </video>
                </vue-plyr>
              </div>
              <div class="column is-full mx-3 px-3">
                <div class="columns is-desktop is-vcentered is-multiline is-mobile">
                  <div :class="!dataPresent ? ismobile ? 'column is-full my-1 py-0' : 'column is-8 my-1 py-0' : ismobile ? 'column is-full my-1 py-0' : 'column is-10 my-1 py-0'">
                      <div class="columns is-mobile is-vcentered py-0 my-0">
                        <div v-if="!ismobile && dataPresent" class="column is-3 mx-0 py-0 my-0">
                          <div class="columns mx-0 px-0 py-0 my-0 is-multiline is-centered">
                            <div class="column mx-0 px-0 py-0 my-0 is-full">
                              <figure class="image is-100x150">
                                <img :src="videoData.poster_path || 'https://img.icons8.com/cotton/2x/video-file--v1.png'">
                              </figure>
                            </div>
                          </div>
                        </div>
                        <div :class="!dataPresent ? ismobile ? 'column is-full' : 'column is-12' : ismobile ? 'column is-full' : 'column is-9'">
                          <div class="columns is-desktop is-multiline is-vcentered py-1 my-1">
                            <div class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Playing:
                                    <span class="is-small has-text-white">
                                      {{ videoData.title || videoData.original_title || videoData.name || videoData.original_name || decodeURIComponent(this.videoname.split('.').slice(0,-1).join('.')) }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="parsedData.season" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Season/Epiode:
                                    <span class="is-small has-text-white">
                                      S{{ parsedData.season }} | E{{ parsedData.episode }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.tagline" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Tagline:
                                    <span class="is-small has-text-white">
                                      <span class="has-text-netflix-only">" </span>
                                      <i>{{ videoData.tagline }}</i>
                                      <span class="has-text-netflix-only"> "</span>
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.status" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Status:
                                    <span class="is-small has-text-white">
                                      {{ videoData.status }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.runtime || videoData.episode_run_time && videoData.episode_run_time.length != 0" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Initial/Release:
                                    <span class="is-small has-text-white">
                                      {{ videoData.release_date || videoData.first_air_date | moment("DD/MM/YY") }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.genres && videoData.genres.length != 0" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Genre:
                                    <span class="is-small has-text-white">
                                      {{ videoData.genres[0].name }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.created_by && videoData.created_by.length != 0" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Created by:
                                    <span class="is-small has-text-white">
                                      {{ videoData.created_by[0].name || "NA" }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.origin_country" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Origin Country:
                                    <span class="is-small has-text-white">
                                      {{ videoData.origin_country[0] }}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div v-if="videoData.homepage" class="column is-full py-0 my-0">
                              <div class="columns is-mobile is-vcentered">
                                <div class="column is-full">
                                  <p class="is-small has-text-grey">
                                    Official Website:
                                    <a :href="videoData.homepage" target="_blank">
                                      <span class="is-small has-text-netflix-only">
                                        Homepage
                                      </span>
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div :class="!dataPresent ? ismobile ? 'column is-full' : 'column is-4' : ismobile ? 'column is-full' : 'column is-2' ">
                    <div class="columns is-multiline is-mobile is-centered has-text-centered is-vcentered">
                      <div :class="!dataPresent ? ismobile ? 'column is-quarter' : 'column is-quarter mx-1' : ismobile ? 'column is-quarter' : 'column is-half'">
                        <button class="button is-netflix-red" @click="modal=true;" v-tooltip.bottom-start="'Play Externally.'">
                          <span class="icon">
                            <i class="fas fa-external-link-square-alt fontonly"></i>
                          </span>
                        </button>
                      </div>
                      <div :class="!dataPresent ? ismobile ? 'column is-quarter' : 'column is-quarter mx-1' : ismobile ? 'column is-quarter' : 'column is-half'">
                        <button class="button is-netflix-red" @click="copy" v-tooltip.bottom-start="'Copy Link'">
                          <span class="icon">
                            <i class="fa fa-copy fontonly"></i>
                          </span>
                        </button>
                      </div>
                      <div :class="!dataPresent ? ismobile ? 'column is-quarter' : 'column is-quarter mx-1' : ismobile ? 'column is-quarter' : 'column is-half'">
                        <button class="button is-netflix-red" @click="downloadButton" v-tooltip.bottom-start="'Download Now.'">
                          <span class="icon">
                            <i class="fas fa-download fontonly"></i>
                          </span>
                        </button>
                      </div>
                      <div :class="!dataPresent ? ismobile ? 'column is-quarter' : 'column is-quarter mx-1' : ismobile ? 'column is-quarter' : 'column is-half'">
                        <button class="button is-netflix-red" @click="subModal=true;" v-tooltip.bottom-start="'Load Custom Subtitles..'">
                          <span class="icon">
                            <i class="fas fa-closed-captioning fontonly"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currVdInfo.size" class="column is-full has-text-right">
              <p class="is-small has-text-white">
                Size: <span class="has-text-netflix-only">{{ currVdInfo.size }}</span>
              </p>
            </div>
            <div v-if="dataPresent" class="column is-full mx-3 my-0 px-3">
              <div class="columns is-multiline is-desktop is-vcentered py-0 my-0">
                <div v-if="videoData.seasons && videoData.seasons.length != 0" class="column is-full py-0 my-0">
                  <div v-for="(season, index) in videoData.seasons" v-bind:key="index" class="columns is-vcentered is-mobile">
                    <div v-if="season.season_number == parsedData.season" :class="ismobile ? 'column is-full' : 'column is-9'">
                      <p class="is-small has-text-grey">
                        About this Season:<span class="has-text-netflix-only"> Season {{ season.season_number }}</span><br>
                        <span class="is-small has-text-white">
                          {{ season.overview }}
                        </span>
                      </p>
                    </div>
                    <div v-if="!ismobile && season.season_number === parsedData.season && videoData.images.posters && videoData.images.posters.length != 0" class="column is-3">
                      <div class="columns mx-0 px-0 py-0 my-0 is-multiline is-centered">
                        <div class="column mx-0 px-0 py-0 my-0 is-full">
                          <figure class="image is-4by3">
                            <img class="is-rounded" v-lazy="videoData.images.posters[0].file_path">
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="dataPresent && !videoData.seasons && videoData.overview" class="column is-full py-1 my-1">
                  <p class="is-small has-text-grey">
                    About:<br>
                    <span class="is-small has-text-white">
                      {{ videoData.overview }}
                    </span>
                  </p>
                </div>
                <div class="column is-full py-1 my-1">
                  <a class="subtitle has-text-netflix" @click="desc = !desc">{{ desc ? 'Hide Info..' : 'Click Here for Cast, Crew & Other Info..' }}</a>
                </div>
                <div v-if="dataPresent && desc" class="column is-full mx-4 px-4 py-4 my-5">
                  <div class="columns is-multiline is-mobile is-vcentered">
                    <div :class="ismobile ? 'columns is-full' : 'column is-two-fifths'">
                      <div class="columns is-multiline is-vcentered">
                        <div class="column is-full py-0 my-0">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column has-text-centered is-full">
                              <p class="subtitle has-text-weight-bold has-text-white">
                                General Details
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="column is-full py-0 my-0">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Original Title:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.original_title || videoData.original_name || videoData.name || decodeURIComponent(this.videoname.split('.').slice(0,-1).join('.')) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.release_date" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Release Date:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.release_date || videoData.first_air_date | moment("DD/MM/YY") }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.runtime || videoData.episode_run_time && videoData.episode_run_time.length != 0" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                {{ videoData.runtime ? "Total Runtime: " : "Average Episode Runtime: " }}
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.runtime || videoData.episode_run_time[0] }}{{ videoData.runtime ? " Minutes" : videoData.episode_run_time[0] ? " Avg. Minutes" : " " }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.genres && videoData.genres.length != 0" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Genres:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span v-for="(genre, index) in videoData.genres" v-bind:key="index" class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ index == videoData.genres.length - 1 ? genre.name : genre.name+", " }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.seasons && videoData.seasons.length != 0" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Total Seasons:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.seasons.length }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.popularity" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Popularity Score (TMDB):
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.popularity }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.vote_average" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Ratings(IMDB):
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.vote_average }} / 10
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.budget" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Total Budget:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.budget }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.revenue" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Gross Revenue:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ videoData.revenue }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="videoData.spoken_languages && videoData.spoken_languages.length != 0" class="column is-full py-0 my-1">
                          <div class="columns is-mulitline is-mobile is-vcentered">
                            <div class="column is-half">
                              <p class="is-small has-text-white">
                                Released Languages:
                              </p>
                            </div>
                            <div class="column is-half">
                              <span v-for="(langs, index) in videoData.spoken_languages" v-bind:key="index" class="subtitle has-text-weight-bold has-text-netflix-only">
                                {{ index == videoData.spoken_languages.length - 1 ? langs.name : langs.name+", " }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="!ismobile && videoData.images && videoData.images.backdrops.length != 0" class="column is-three-fifths">
                      <div class="columns mx-0 px-0 py-0 my-0 is-multiline is-centered">
                        <div class="column mx-0 px-0 py-0 my-0 is-full">
                          <figure class="image">
                            <img v-lazy="videoData.images.backdrops[0].file_path">
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="desc && videoData.credits && videoData.credits.cast.length != 0" class="column is-full mx-1">
                  <div class="columns is-multiline is-desktop is-vcentered">
                    <div class="column is-full">
                      <div class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <p class="is-small has-text-grey">
                              Cast:
                            </p>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-left" @click="swipeLeft('cast')"></i>
                            </span>
                          </div>
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-right" @click="swipeRight('cast')"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns is-mobile is-vcentered scroll-block" ref="cast">
                        <div v-for="(people, index) in videoData.credits.cast" v-bind:key="index" :class="ismobile ? 'column is-6 mx-0 px-0 scroll-link' : 'column is-2 mx-2 px-2 scroll-link'">
                          <div class="columns is-desktop is-centered is-vcentered is-multiline">
                            <div class="column mx-1 px-1 is-full">
                              <figure class="image">
                                <img v-lazy="people.profile_path == null ? people.gender == 0 ? 'https://i.ibb.co/tPTLybZ/Blank-Person-462x600.jpg' : 'https://i.ibb.co/SR5L4Dy/avatar-female-tall.jpg' : people.profile_path">
                              </figure>
                            </div>
                            <div class="column has-text-centered is-full">
                              <p class="is-small has-text-white scroll-text">
                                {{ people.name.length > 15 ? people.name.slice(0,15)+"..." : people.name }}<br>
                                <span class="is-small has-text-grey scroll-text">
                                  (as {{ people.character.length > 15 ? people.character.slice(0, 15)+"..." : people.character }})
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="desc && videoData.credits && videoData.credits.crew.length != 0" class="column is-full mx-1">
                  <div class="columns is-multiline is-desktop is-vcentered">
                    <div class="column is-full">
                      <div class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <p class="is-small has-text-grey">
                              Crew:
                            </p>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-left" @click="swipeLeft('crew')"></i>
                            </span>
                          </div>
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-right" @click="swipeRight('crew')"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns is-mobile is-vcentered scroll-block" ref="crew">
                        <div v-for="(people, index) in videoData.credits.crew" v-bind:key="index" :class="ismobile ? 'column is-6 mx-0 px-0 scroll-link' : 'column is-2 mx-2 px-2 scroll-link'">
                          <div class="columns is-desktop is-centered is-vcentered is-multiline">
                            <div class="column mx-1 px-1 is-full">
                              <figure class="image">
                                <img v-lazy="people.profile_path == null ? people.gender == 0 ? 'https://i.ibb.co/tPTLybZ/Blank-Person-462x600.jpg' : 'https://i.ibb.co/SR5L4Dy/avatar-female-tall.jpg' : people.profile_path">
                              </figure>
                            </div>
                            <div class="column has-text-centered is-full">
                              <p class="is-small has-text-white scroll-text">
                                {{ people.name.length > 15 ? people.name.slice(0,15)+"..." : people.name }}<br>
                                <span class="is-small has-text-grey scroll-text">
                                  ({{ people.job.length > 15 ? people.job.slice(0,15)+"..." : people.job }})
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="desc && videoData.production_companies && videoData.production_companies.length != 0" class="column is-full mx-1">
                  <div class="columns is-multiline is-desktop is-vcentered">
                    <div class="column is-full">
                      <div class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <p class="is-small has-text-grey">
                              Produced by:
                            </p>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-left" @click="swipeLeft('production')"></i>
                            </span>
                          </div>
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-right" @click="swipeRight('production')"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns is-mobile is-vcentered scroll-block" ref="production">
                        <div v-for="(company, index) in videoData.production_companies" v-bind:key="index" :class="ismobile ? 'column is-6 mx-0 px-0 scroll-link' : 'column is-2 mx-2 px-2 scroll-link'">
                          <div class="columns is-desktop is-centered is-vcentered is-multiline">
                            <div class="column is-full">
                              <figure class="image">
                                <img v-lazy="company.logo_path == null ? 'https://i.ibb.co/Hqkdh46/movie-people-production-24908-58149.jpg' : company.logo_path">
                              </figure>
                            </div>
                            <div class="column has-text-centered is-full">
                              <p class="is-small has-text-white scroll-text">
                                {{ company.name.length > 15 ? company.name.slice(0,15) : company.name }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="desc && videoData.networks && videoData.networks.length != 0" class="column is-full mx-1">
                  <div class="columns is-multiline is-desktop is-vcentered">
                    <div class="column is-full">
                      <div class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <p class="is-small has-text-grey">
                              Networking Partners:
                            </p>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-left" @click="swipeLeft('network')"></i>
                            </span>
                          </div>
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-right" @click="swipeRight('network')"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns is-mobile is-vcentered scroll-block" ref="network">
                        <div v-for="(network, index) in videoData.networks" v-bind:key="index" :class="ismobile ? 'column is-6 mx-0 px-0 scroll-link' : 'column is-2 mx-2 px-2 scroll-link'">
                          <div class="columns is-desktop is-centered is-vcentered is-multiline">
                            <div v-if="network.logo_path != null" class="column is-full">
                              <figure class="image">
                                <img v-lazy="network.logo_path">
                              </figure>
                            </div>
                            <div class="column has-text-centered is-full">
                              <p class="is-small has-text-white scroll-text">
                                {{ network.name.length > 15 ? network.name.slice(0,15) : network.name }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="desc && videoData.videos && videoData.videos.results.length != 0" class="column is-full mx-1">
                  <div class="columns is-multiline is-desktop is-vcentered">
                    <div class="column is-full">
                      <div class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <p class="is-small has-text-grey">
                              Related Videos:
                            </p>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-left" @click="swipeLeft('related')"></i>
                            </span>
                          </div>
                          <div class="level-item">
                            <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                              <i class="fas fa-arrow-alt-circle-right" @click="swipeRight('related')"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns is-mobile is-vcentered scroll-block" ref="related">
                        <div v-for="(video, index) in videoData.videos.results" v-bind:key="index" :class="ismobile ? 'column is-full mx-0 px-0 scroll-link' : 'column is-5 mx-1 px-1 scroll-link'">
                          <div class="columns is-desktop is-centered is-vcentered is-multiline">
                            <div class="column is-full">
                              <lazy-component tag="figure" class="image is-16by9">
                                <iframe class="has-ratio" width="640" height="360" :src="video.key.replace('/watch?v=', '/embed/')" frameborder="0" allowfullscreen></iframe>
                              </lazy-component>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class=" modal ? 'modal is-active' : 'modal' ">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title has-text-centered">External Players</p>
            <button class="delete" @click="modal = false;" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns is-centered is-mobile" v-for="(item, index) in players" v-bind:key="index">
              <div class="column is-3">
                <figure class="image is-48x48" style="margin: 0 auto;">
                  <img class="icon" :src="item.icon" />
                </figure>
              </div>
              <div class="column is-5">
                <p class>{{ item.name }}</p>
              </div>
              <div class="column is-4">
                <button class="button is-netflix-red is-rounded" @click="modal = false;handleExternalPlay(item.name)">
                  <span class="icon is-small">
                    <i class="fas fa-play"></i>
                  </span>
                  <span>Play</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div :class="subModal ? 'modal is-active' : 'modal'">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Load Subtitle File</p>
            <button class="delete" @click="subModal = false;" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <article :class=" successMessage ? 'message is-success' : 'message is-hidden is-success'">
              <div class="message-body">
                <button class="delete" @click="successMessage = false" aria-label="delete"></button>
                {{ resultmessage }}
              </div>
            </article>
            <div class="field">
              <div class="control">
                <input :class=" subButLoad ? 'input is-rounded is-success is-loading' : 'input is-rounded is-success' " v-model="subripurl" type="text" :placeholder="'Enter Any Url or Give Path from Drive'">
              </div>
            </div>
            <div class="field">
              <p class="control">
                <input :class=" subButLoad ? 'input is-rounded is-success is-loading' : 'input is-rounded is-success' " placeholder="Label for Subtitle File" id="sublabel" type="text" v-model="custsublabel" required>
              </p>
            </div>
            <div class="content">
              <li>Note: Only Give Valid Url's otherwise this page will get Hanged on Sent Back.</li>
              <li>If You Want to Give drive Path, Give in this Format: <b><i>folder/sub-folder1/sub-folder2</i></b> from Root Folder.</li>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button :class=" subButLoad ? 'button is-loading is-success' : 'button is-success' " @click="loadCustomSub(subripurl, custsublabel)">Save changes</button>
          </footer>
        </div>
      </div>
      <div :class="ismobile ? 'column is-centered is-vcentered is-one-third is-desktop golist' : 'column is-desktop is-centered is-vcentered is-one-third golist mt-4'" v-loading="loading">
        <div class="column is-full">
          <div class="columns is-mobile is-multiline is-centered is-vcentered">
            <div :class="ismobile ? 'column is-full mx-0 my-0 py-1 px-0' : 'column is-two-thirds mx-0 px-0'">
              <div class="field has-addons is-grouped">
                <div class="control is-expanded has-icons-right is-dark">
                  <input class="input is-rounded searchbar-input"  type="search" v-tooltip.bottom-start="'Filter Videos'" v-model="searchBarTerm" placeholder="Continue Your Binge / Search Videos Here..">
                  <span class="icon has-text-netflix-only is-small is-right" style="padding:0 5px;">
                    <i class="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            <div :class="ismobile ? 'column is-full mx-0 my-0 px-0 py-1' : 'column is-one-third mx-0 px-0'">
              <h6 class="has-text-right has-text-grey">Found {{ files ? files.length : "0" }} Results</h6>
            </div>
          </div>
        </div>
        <div class="column is-full">
          <div class="columns has-background-dark suggestList is-multiline is-mobile is-centered is-vcentered" v-for="(file, index) in files" v-bind:key="index" @click="action(file,'view')">
            <div class="column is-2">
              <svg class="iconfont" style="font-size: 20px">
                <use :xlink:href="getIcon(file.mimeType)" />
              </svg>
            </div>
            <div class="column is-10">
              <div class="columns is-desktop is-multiline">
                <div class="column is-full">
                  <p class="is-small is-clipped has-text-white">{{ file.name }}</p>
                </div>
                <div class="column is-full">
                  <div class="columns is-mobile is-multiline">
                    <div :class="ismobile ? 'column has-text-left is-12' : 'column has-text-left is-8'">
                      <p class="is-small is-clipped has-text-grey">
                        {{ file.modifiedTime }}
                      </p>
                    </div>
                    <div :class="ismobile ? 'column is-hidden has-text-right is-4' : 'column has-text-right is-4'">
                      <p class="is-small is-clipped has-text-grey">
                        {{ file.size }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="loading"
          class="has-text-centered no-content"
          :style="'background: url('+loadImage+') no-repeat 50% 50%;height: 240px;line-height: 240px;text-align: center;margin-top: 20px;'"
          >
        </div>
      </div>
    </div>
    <div :class="videomodal ? 'modal is-active' : 'modal'">
      <div class="modal-background"></div>
      <div class="modal-content">
        <figure class="image is-16by9">
          <iframe class="has-ratio" width="640" height="360" :src="modalVideo" frameborder="0"></iframe>
        </figure>
      </div>
      <button class="modal-close is-large" @click="videomodal = false;modalVideo = '';" aria-label="close"></button>
    </div>
  </div>
</template>

<script>
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import { getItem } from '@utils/encryptUtils';
import {
  initializeUser,
  getgds,
  scrollTo,
} from "@utils/localUtils";
import {
  formatDate,
  formatFileSize,
  checkoutPath,
  checkView,
} from "@utils/AcrouUtil";
import Loading from 'vue-loading-overlay';
import { mapState } from "vuex";
import { decode64 } from "@utils/AcrouUtil";
import { srt2vtt, players } from "@utils/playUtils";
import notify from "@/components/notification";
export default {
  components: {
    Loading,
  },
  metaInfo() {
    return {
      title: this.metatitle,
      titleTemplate: (titleChunk) => {
        if(titleChunk && this.siteName){
          return titleChunk ? `${titleChunk} | ${this.siteName}` : `${this.siteName}`;
        } else {
          return "Loading..."
        }
      },
    }
  },
  data: function() {
    return {
      metatitle: "",
      apiurl: "",
      externalUrl: "",
      downloadUrl: "",
      videourl: "",
      poster: "",
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      mainLoad: false,
      fullpage: true,
      ismobile: false,
      user: {},
      token: {},
      searchBarTerm: "",
      searchBarfaIcon: "fab fa-searchengin",
      videokey: 0,
      mediaToken: "",
      modal: false,
      infiniteId: +new Date(),
      loading: true,
      suburl: [],
      sub: false,
      desc: false,
      subModal: false,
      subButLoad: false,
      subripurl: "",
      videoData: {},
      parsedData: {},
      currVdInfo: {},
      prevRoute: getItem("prev"),
      dataPresent: false,
      infoPanel: true,
      infoChange: 0,
      custsublabel: "",
      successMessage: false,
      resultmessage: "",
      playicon: "fas fa-spinner fa-pulse",
      playtext: "Loading Stuffs....",
      videoname: "",
      videomodal: false,
      modalVideo: "",
      loadImage: "",
      gds: [],
      currgd: {},
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      player: {},
      viewer: false,
      icon: {
        "video/mp4": "icon-mp",
        "video/x-matroska": "icon-mkv",
        "video/x-msvideo": "icon-avi",
        "video/webm": "icon-webm",
      },
    };
  },
  methods: {
    infiniteHandler($state) {
      // The first time you enter the page does not execute the scroll event
      if (!this.page.page_token) {
        return;
      }
      this.page.page_token++;
      this.render($state);
    },
    initializeUser(){
      var userData = initializeUser();
      if(userData.isThere){
        if(userData.type == "hybrid"){
          this.user = userData.data.user;
          this.logged = userData.data.logged;
        } else if(userData.type == "normal"){
          this.user = userData.data.user;
          this.token = userData.data.token;
          this.logged = userData.data.logged;
        }
      } else {
        this.logged = userData.data.logged;
      }
      this.getVideourl();
    },
    render($state) {
      this.player = this.$refs.plyr.player
      this.mainLoad = true;
      this.initializeUser();
      this.getFiles($state);
      this.getVideoData(decodeURIComponent(this.videoname.split('.').slice(0,-1).join('.')));
      this.checkMobile();
      this.mainLoad = false;
      // if(!this.infoPanel) this.player.play();
    },
    getFiles($state){
      this.metatitle = "Loading...";
      var path = this.url.split(this.url.split('/').pop())[0];
      var password = localStorage.getItem("password" + path);
      var p = {
        q: "",
        password: password || null,
        ...this.page,
      };
      this.axios
        .post(path, p)
        .then((res) => {
          var body = res.data;
          if (body) {
            // Determine the response status
            if (body.error && body.error.code == "401") {
              this.checkPassword(path);
              return;
            }
            var data = body.data;
            if (!data) return;
            this.page = {
              page_token: body.nextPageToken,
              page_index: body.curPageIndex,
            };
            if ($state) {
              this.originalFiles.push(...this.buildFiles(data.files));
              this.files.push(this.getFilteredFiles(...this.buildFiles(data.files)));
              this.currVdInfo = this.getCurrVdInfo(...this.buildFiles(data.files))[0];
              this.checkSuburl();
              this.getPoster();
            } else {
              this.originalFiles = this.buildFiles(data.files)
              this.files = this.getFilteredFiles(this.buildFiles(data.files));
              this.checkSuburl();
              this.currVdInfo = this.getCurrVdInfo(this.buildFiles(data.files))[0];
              this.getPoster();
            }
          }
          if (body.nextPageToken) {
            this.$refs.infinite.stateChanger.loaded();
          } else {
            this.$refs.infinite.stateChanger.complete();
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    buildFiles(files) {
      this.metatitle = decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
      var path = this.url.split(this.url.split('/').pop())[0];
      return !files
        ? []
        : files
            .map((item) => {
              var p = path + checkoutPath(item.name, item);
              let isFolder =
                item.mimeType === "application/vnd.google-apps.folder";
              let size = isFolder ? "-" : formatFileSize(item.size);
              return {
                path: p,
                ...item,
                modifiedTime: formatDate(item.modifiedTime),
                size: size,
                isFolder: isFolder,
              };
            })
    },
    checkPassword(path) {
      var pass = prompt(this.$t("list.auth"), "");
      localStorage.setItem("password" + path, pass);
      if (pass != null && pass != "") {
        this.render(path);
      } else {
        this.$router.go(-1);
      }
    },
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    checkSuburl() {
      const toks = this.videoname.split('.');
      const pathSansExt = toks.slice(0, -1).join('.');
      const regext = new RegExp(`(?<name>${pathSansExt})`+'\\.(?<label>[\\s\\S\\D]+)\\.(?<format>srt|vtt)');
      return this.originalFiles.forEach(async (item) => {
         if(item.name == pathSansExt + ".srt" || item.name == pathSansExt + ".vtt"){
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
             this.$notify({
               title: "Subtitle Loaded",
               message: "Done",
               type: "info",
             })
             this.suburl = this.suburl.concat([{url: blob.blobData, label: "Default"}]);
             this.videokey = this.videokey + 1
           } else {
             this.sub = false;
             this.suburl = [];
           }
         } else if(regext.test(item.name)){
           let groups = regext.exec(item.name).groups;
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
             this.$notify({
               title: "Subtitle Loaded",
               message: "Done",
               type: "info",
             })
             this.suburl = this.suburl.concat([{url: blob.blobData, label: groups.label}]);
             this.videokey = this.videokey + 1
           } else {
             this.sub = false;
             this.suburl = [];
           }
         } else {
           this.sub = false;
           this.suburl = [];
         }
      });
    },
    getVideoData(title){
      if(this.prevRoute == "video"){
        this.dataPresent = false;
        this.infoPanel = false;
      }
      this.$backend.post(apiRoutes.getMediaData, {
        email: this.user.email,
        title: title
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.data){
          this.dataPresent = true;
          this.videoData = response.data.result;
          this.parsedData = response.data.parsedData;
          if(!this.infoPanel) this.player.play();
        } else {
          this.player.play();
          this.dataPresent = false;
          this.infoPanel = false;
        }
      })
    },
    async getSrtFile(url) {
      try {
        const srt = await this.$backend.get(url);
        const blob = new Blob([srt2vtt(srt.data)], { type: 'text/vtt' })
        var srtBlob = URL.createObjectURL(blob);
        return {
          blobData: srtBlob,
          success: true
        };
      } catch(e) {
        return {
          blobData: null,
          success: false
        };
      }
    },
    async loadCustomSub(url, label) {
      this.subButLoad = true;
      const urlRegex = /(http:\/\/|https:\/\/[\s\S]+)/;
      if(urlRegex.test(url)){
        let blob = await this.getSrtFile(url);
        if(blob.success){
          this.suburl = this.suburl.concat([{url: blob.blobData, label: label}]);
          this.$notify({
            title: "Subtitle Loaded",
            message: "Done",
            type: "info",
          })
          this.videokey = this.videokey + 1
          this.successMessage = true;
          this.resultmessage = "Subtitle Loaded Successfully !"
          this.subButLoad = false;
          setTimeout(() => {
            this.subModal = false;
          }, 300);
        } else {
          this.successMessage = true;
          this.resultmessage = "Error Loading the Subtitle. Please Check Your Link."
          this.subButLoad = false;
        }
      } else {
        let getUrl = "/"+this.currgd.id+":/"+url+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
        let blob = await this.getSrtFile(getUrl);
        if(blob.success){
          this.suburl = this.suburl.concat([{url: blob.blobData, label: label}]);
          this.videokey = this.videokey + 1
          this.$notify({
            title: "Subtitle Loaded",
            message: "Done",
            type: "info",
          })
          this.successMessage = true;
          this.resultmessage = "Subtitle Loaded Successfully !"
          this.subButLoad = false;
          setTimeout(() => {
            this.subModal = false;
          }, 300);
        } else {
          this.successMessage = true;
          this.resultmessage = "Error Loading the Subtitle. Please Check Your Link."
          this.subButLoad = false;
        }
      }
    },
    loadFlv(options) {
      import("@/plugin/video-plugins/flv").then((res) => {
        var Flv = res.default;
        Flv(options);
      });
    },
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : "";
    },
    copy() {
      this.$notify({
        title: "Processing",
        message: "Generating Streaming Links",
        type: "info",
      })
      this.mainLoad = true;
      this.$backend.post(apiRoutes.mediaTokenTransmitter, {
        email: this.user.email,
        token: this.token.token,
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.token){
          let link = this.videourl+"?player=external"+"&email="+this.user.email+"&token="+response.data.token;
          this.mainLoad = false;
          navigator.clipboard.writeText(link).then(function() {
            notify({
              title: "Copied !!",
              message: "Successfully Copied.",
              type: "success",
            })
          }, function(err) {
            notify({
              title: "Failed",
              message: "Failed to Copied - "+err,
              type: "error",
            })
          });
          return;
        } else {
          this.mainLoad = false;
          return;
        }
      }).catch(e => {
        console.log(e);
        this.mainLoad = false;
        return;
      })
    },
    handleExternalPlay(name){
      this.$notify({
        title: "Playing Externally",
        message: "Generating Streaming Link",
        type: "success",
      })
      this.mainLoad = true;
      this.$backend.post(apiRoutes.mediaTokenTransmitter, {
        email: this.user.email,
        token: this.token.token,
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.token){
          let link = this.videourl+"?player=external"+"&email="+this.user.email+"&token="+response.data.token;
          var curplay = players(link, this.videoname).filter((player) => {
            return player.name == name;
          })[0];
          this.mainLoad = false;
          location.href=curplay.scheme
          return;
        } else {
          this.mainLoad = false;
          return;
        }
      }).catch(e => {
        console.log(e);
        this.mainLoad = false;
        return;
      })
    },
    downloadButton() {
      this.$notify({
        title: "Downloading Now",
        message: "Generating Links and Downloading",
        type: "success",
      })
      this.mainLoad = true;
      this.$backend.post(apiRoutes.mediaTokenTransmitter, {
        email: this.user.email,
        token: this.token.token,
      }, backendHeaders(this.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.token){
          let link = window.location.origin+encodeURI(this.url.replace(/^\/(\d+:)\//, "/$1down/"))+"?player=download"+"&email="+this.user.email+"&token="+response.data.token;
          console.log(link);
          this.mainLoad = false;
          location.href=link;
          return;
        } else {
          this.mainLoad = false;
          return;
        }
      }).catch(e => {
        console.log(e);
        this.mainLoad = false;
        return;
      })
    },
    getCurrVdInfo(rawFiles){
      return rawFiles.filter(file => {
        return file.name == this.url.split('/').pop();
      })
    },
    getVideourl() {
      this.videoname = this.url.split('/').pop();
      this.videourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.videourl+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token;
    },
    tapPlay(){
      this.infoPanel = false;
      this.player.play();
    },
    playOutside(link){
      this.modalVideo = link.replace("/watch?v=", "/embed/");
      this.videomodal = true;
    },
    getIcon(type) {
      return "#" + (this.icon[type] ? this.icon[type] : "icon-weizhi");
    },
    getPoster() {
      var data = this.originalFiles.filter((file) => {
        return file.name == this.videoname
      })[0].thumbnailLink;
      this.poster = data;
    },
    swipeLeft(func) {
      const content = "this.$refs."+func;
      scrollTo(eval(content), -300, 400);
    },
    swipeRight(func) {
      const content = "this.$refs."+func;
      scrollTo(eval(content), 300, 400);
    },
    action(file, target) {
      let path = file.path;
      if (target === "view") {
        this.$router.push({
          path: checkView(path),
        });
        return;
      }
    },
    getFilteredFiles(rawFiles) {
      const videoRegex = /(video)\/(.+)/
      return rawFiles.filter(file => {
        return file.name != this.url.split('/').pop();
      }).filter(file => {
        return videoRegex.test(file.mimeType);
      });
    },
  },
  computed: {
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return "";
    },
    ...mapState("acrou/view", ["mode"]),
    players() {
      return players().map((player) => {
        return {
          name: player.name,
          icon: player.icon
        }
      })
    },
  },
  mounted() {
    if(this.$audio.player() != undefined) this.$audio.destroy();
    if(window.themeOptions.loading_image){
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif"
    }
    this.render();
  },
  created() {
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  watch: {
    searchBarTerm: function() {
      if(this.searchBarTerm.length > 0){
        const searchRegex = new RegExp(this.searchBarTerm.toLowerCase());
        this.files = this.getFilteredFiles(this.originalFiles.filter((file) => {
          return searchRegex.test(file.name.toLowerCase());
        }));
      } else {
        this.files = this.getFilteredFiles(this.originalFiles);
      }
    },
    screenWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    windowWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    player: function(){
      this.player.on('ready', () => {
        this.playicon="fas fa-glasses";
        this.playtext="Let's Party"
      });
      this.player.on('playing', () => {
        this.playicon="fas fa-spin fa-compact-disc";
        this.metatitle = "Playing"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playtext="Playing"
      });
      this.player.on('pause', () => {
        this.playicon="fas fa-pause";
        this.metatitle = "Paused"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playtext="Paused"
      });
    }
  }
};
</script>
