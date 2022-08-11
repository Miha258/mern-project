export const useMail = () => {
    const needOpenAccount = (userId, name, surname) => {
        return `
            <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            </head>
                <body>
                    <div id="root">
                        <h1>You need to open account for: ${surname} ${name}</h1>
                        <a className="dark-grey waves-light btn text-center" href="http://localhost:3000/manager/user-accounts#${userId}">Accept</a>
                    </div>
                </body>
            </html>
        `
    }
    const accountOpened = (name, surname) => {
        return `
            <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            </head>
                <body>
                    <div id="root">
                        <h1>Dear ${surname} ${name}.Your account has been opened</h1>
                        <a className="dark-grey waves-light btn text-center" href="http://localhost:3000/user/account">Check</a>
                    </div>
                </body>
            </html>
        `
    }
    
    const accountClosed = (name, surname) => {
        return `
            <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            </head>
                <body>
                    <div id="root">
                        <h1>Dear ${surname} ${name}.Your has been deleted by MERN BANK manager</h1>
                    </div>
                </body>
            </html>
        `
    }

    return {needOpenAccount, accountOpened, accountClosed}
}