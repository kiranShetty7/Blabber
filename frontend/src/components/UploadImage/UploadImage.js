const UploadImage = ()=>{

    const handleFileInputChange = async (event) => {
        const pic = event.target.files[0];

        setPicLoading(true);

        if (!pic) {
            clearErrors('image');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(pic.type)) {
            setError('image', {
                type: 'custom',
                message: 'Image must be in JPEG or PNG format',
            });
            event.target.value = '';
            return;
        }

        if (pic.size > 5 * 1024 * 1024) {
            setError('image', {
                type: 'custom',
                message: 'Image must be under 5MB',
            });
            event.target.value = '';
            return;
        }

        const data = new FormData();
        data.append('file', pic);
        data.append('upload_preset', 'Blabber');
        data.append('cloud_name', 'dxludokby');
        fetch('https://api.cloudinary.com/v1_1/dxludokby/image/upload', {
            method: 'post',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setProfileLink(data.url);
                setPicLoading(false);
                setUploadSuccess(true);
            })
            .catch((err) => {
                console.log(err);
                setPicLoading(false);
            });

        clearErrors('image');
    };




    return(<>
                <input
                        type="file"
                        id="imageInput"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />

                    <span className={classes.error}>{errors.image && errors.image.message}</span>
                    <span style={{ width: '100%', textAlign: 'center' }}>Weave your visual charm</span>
                    <span style={{ fontSize: '0.75rem' }}>  Upload an image (JPEG or PNG, max 5MB)</span>
                    {!picLoading ? (
                        uploadSuccess ? (
                            <div className={classes.uploadSuccess}>
                                <CheckCircleIcon />
                                <span>Uploaded successfully</span>
                            </div>
                        ) : (
                            <label htmlFor="imageInput">
                                <CloudUploadOutlinedIcon
                                    sx={{ fontSize: '5rem', color: '#707070', cursor: 'pointer' }}
                                />
                            </label>
                        )
                    ) : (
                        <Loader />
                    )}

    </>)
}

export default UploadImage