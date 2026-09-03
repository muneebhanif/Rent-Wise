import { extendTheme } from '@chakra-ui/react'



const theme  =  extendTheme ({
    components:{
        Button:{
            variants:{
                customButton:{
                    bg: 'orange.400',
                    color:'white',
                    borderRadius: "md",
                    _hover:{
                        bg:'white',
                        color:"orange.500",
                        borderRadius:'md',
                        border:'1px solid orange',
                        cursor:'pointer',
                    }
                },
                dashboardButton:{
                    bg:"orange.300",
                    color:'white',
                    borderRadius: "md",
                    _hover:{
                        bg:'white',
                        color:"orange.500",
                        borderRadius:'md',
                        border:'1px solid orange',
                        cursor:'pointer',
                    }
                }
            }
        },
        Card:{
            variants:{
                normalCard:{
                    _hover:{ boxShadow: 'lg' },
                     transition:"box-shadow 0.3s",
                     bg:'red'
                },
                baseStyle: {
                    borderWidth: '1px',
                    borderRadius: 'lg',
                    boxShadow: 'sm',
                    bg:'green'
                  },

            }
        },  
    }
})

export default theme;
