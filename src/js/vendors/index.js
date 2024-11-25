import 'pannellum/build/pannellum'
import '../css/style.css'

function compressImage(imageUrl, quality = 0.8) {
    return new Promise((resolve, reject) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const img = new Image();
                const url = URL.createObjectURL(blob);
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);

                    const compressedData = canvas.toDataURL('image/jpeg', quality);

                    resolve(compressedData);
                };

                img.src = url; // Khởi tạo ảnh từ URL
            })
            .catch(err => reject(err));
    });
}

// async function initPannellum(url) {
//     try {
//
//         let configData = null
//         await fetch(`${url}/config.json`)
//             .then(response => response.json())
//             .then(config => {
//                 configData = config;
//             })
//             .catch(error => console.error('Error loading config:', error));
//         console.log('configData: ', configData);
//         const viewer = pannellum.viewer('viewer', {basePath: url,autoLoad:true,...configData});

//     } catch (error) {
//         console.error('Error compressing image:', error);
//     }
// }


// document.addEventListener('DOMContentLoaded', initPannellum('assets/images/main'));

let viewer = null;  // Declare viewer globally to track the current instance

function hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    var span = document.createElement('span');
    span.innerHTML = args;
    hotSpotDiv.appendChild(span);
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';
}

async function initPannellum(imagePath) {
    try {
        // Compress the image
        // const compressedImage = await compressImage(`assets/images/${imagePath}`, 1);

        // If a viewer already exists, destroy it before initializing a new one
        if (viewer) {
            viewer.destroy();
        }

        const config = {
            "default": {
                "firstScene": imagePath.split('.')[0],
                "sceneFadeDuration": 1000,
                "autoLoad":true,
                "showControls": false,
            },
            "scenes": {}
        };

        config.scenes = {
            "image1": {
                "title": "Scene 1",
                "hfov": 110,
                "pitch": -3,
                "yaw": 117,
                "type": "equirectangular",
                "panorama": await compressImage(`assets/images/image1.jpg`, 1), // Ensure the panorama is passed here
                "hotSpots": [
                    {
                        "pitch": 10,
                        "yaw": 50,
                        "type": "scene",
                        "text": "Scene 2",
                        "sceneId": "image2",
                        "createTooltipArgs": "Scene 2",
                        "createTooltipFunc": hotspot,
                        "cssClass": "custom-hotspot",
                    }
                ]
            },
            "image2": {
                "title": "Scene 2",
                "hfov": 110,
                "pitch": -5,
                "yaw": 150,
                "type": "equirectangular",
                "panorama": await compressImage(`assets/images/image2.jpg`, 1),
                "hotSpots": [
                    {
                        "pitch": -5,
                        "yaw": 150,
                        "type": "scene",
                        "text": "Scene 3",
                        "sceneId": "image3",
                        "createTooltipArgs": "Scene 3",
                        "createTooltipFunc": hotspot,
                        "cssClass": "custom-hotspot",
                    }
                ]
            },
            "image3": {
                "title": "Scene 3",
                "hfov": 110,
                "pitch": 0,
                "yaw": -70,
                "type": "equirectangular",
                "panorama": await compressImage(`assets/images/image3.jpg`, 1), // Ensure the panorama is passed here
                "hotSpots": [
                    {
                        "pitch": 0,
                        "yaw": -70,
                        "type": "scene",
                        "text": "Scene 4",
                        "sceneId": "image4",
                        "createTooltipArgs": "Scene 4",
                        "createTooltipFunc": hotspot,
                        "cssClass": "custom-hotspot",
                    }
                ]
            },
            "image4": {
                "title": "Scene 4",
                "hfov": 110,
                "pitch": 5,
                "yaw": 200,
                "type": "equirectangular",
                "panorama": await compressImage(`assets/images/image4.jpg`, 1),// Ensure the panorama is passed here
                "hotSpots": [
                    {
                        "pitch": 5,
                        "yaw": 200,
                        "type": "scene",
                        "text": "Scene 5",
                        "sceneId": "image5",
                        "createTooltipArgs": "Scene 5",
                        "createTooltipFunc": hotspot,
                        "cssClass": "custom-hotspot",
                    }
                ]
            },
            "image5": {
                "title": "Scene 5",
                "hfov": 110,
                "pitch": 10,
                "yaw": 50,
                "type": "equirectangular",
                "panorama": await compressImage(`assets/images/image5.jpg`, 1), // Ensure the panorama is passed here
                "hotSpots": [
                    {
                        "pitch": 10,
                        "yaw": 50,
                        "type": "scene",
                        "text": "Scene 1",
                        "sceneId": "image1",
                        "createTooltipArgs": "Scene 1",
                        "createTooltipFunc": hotspot,
                        "cssClass": "custom-hotspot",
                    }
                ]
            }
        };
        viewer = pannellum.viewer('viewer', config);

        const autoRotate = document.getElementById('autoRotate');
        let stateRotate = false;
        autoRotate.addEventListener('click', e => {
            if (!stateRotate) {
                autoRotate.innerHTML = "<img height=\"20\" width=\"20\" src=\"assets/images/no_rotate.png\" alt=\"\"/>"
                viewer.startAutoRotate(-3.5, viewer.getPitch());
                stateRotate = true;
            } else {
                autoRotate.innerHTML = "<img height=\"20\" width=\"20\" src=\"assets/images/rotate.png\" alt=\"\"/>"
                viewer.stopAutoRotate();
                stateRotate = false;
            }

        })
        const aboutMsg = document.getElementsByClassName('pnlm-about-msg')[0];
        if (aboutMsg) {
            aboutMsg.innerHTML = '';
            console.log('Removed all child elements');
        }

        viewer.getContainer().addEventListener('contextmenu', (e) => {
            aboutMsg.innerHTML = '<a href="https://hesosoft.com/" target="_blank">HESO Co.,ltd</a>';
        })

        let stateSound = false;
        const sound = document.getElementById('sound');
        sound.addEventListener('click', () => {
            if (!stateSound) {
                sound.innerHTML = "<img height=\"20\" width=\"20\" src=\"assets/images/mute.png\" alt=\"\"/>"
                stateSound = true;
            } else {
                sound.innerHTML = "<img height=\"20\" width=\"20\" src=\"assets/images/volume.png\" alt=\"\"/>"
                stateSound = false;
            }
        })

        const fullScreen = document.getElementById('fullScreen');
        fullScreen.addEventListener('click', e => {
            viewer.toggleFullscreen()
        })
    } catch (error) {
        console.error('Error compressing image:', error);
    }
}


document.addEventListener('DOMContentLoaded', (initPannellum("image1")) );

document.getElementById('carousel').addEventListener('click', (event) => {
    const target = event.target.closest('.carousel-item'); // Find the clicked carousel item
    if (target) {
        const name = target.getAttribute('data-name'); // Get the name from data attribute
        initPannellum(name);
    }
});
