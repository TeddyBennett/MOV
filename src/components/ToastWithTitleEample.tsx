"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/Button"
import React from 'react';

interface ToastWithTitleProps {
    title: string;
    body: string;
}

const ToastWithTitle: React.FC<ToastWithTitleProps> = (props) => {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        console.log('click',props.title,props.body)
        toast({
          title: props.title,
          description: props.body,
        })
      }}
    >
      Show Toast
    </Button>
  )
}

export default ToastWithTitle
